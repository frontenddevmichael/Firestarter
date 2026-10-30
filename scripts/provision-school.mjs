#!/usr/bin/env node
/**
 * Provision a school account for the Firestarter Young Poets Prize.
 *
 * This creates (or reuses) a school, creates a school-admin auth user, and
 * links the user to the school. It uses the service-role key, so run it
 * locally only and never commit the key.
 *
 * Usage:
 *   SUPABASE_URL="https://<ref>.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
 *   SCHOOL_NAME="Example Secondary School" \
 *   SCHOOL_CONTACT_NAME="Mrs Example" \
 *   SCHOOL_CONTACT_EMAIL="teacher@example.com" \
 *   SCHOOL_ADMIN_NAME="Mrs Example" \
 *   SCHOOL_ADMIN_EMAIL="school.admin@example.com" \
 *   SCHOOL_ADMIN_PASSWORD="a-strong-temporary-password" \
 *   node scripts/provision-school.mjs
 *
 * Optional:
 *   SCHOOL_RESULTS_VISIBLE=false   hide scores/feedback from the school (default true)
 *   SCHOOL_ADMIN_PASSWORD=...      also resets the password when the user already exists
 */

import process from 'node:process'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function required(name) {
  const value = process.env[name]
  if (!value || !value.trim()) {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value.trim()
}

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const schoolName = required('SCHOOL_NAME')
const contactName = process.env.SCHOOL_CONTACT_NAME?.trim() || ''
const contactEmail = process.env.SCHOOL_CONTACT_EMAIL?.trim() || ''
const adminName = required('SCHOOL_ADMIN_NAME')
const adminEmail = required('SCHOOL_ADMIN_EMAIL').toLowerCase()
const adminPassword = process.env.SCHOOL_ADMIN_PASSWORD
const resultsVisible = process.env.SCHOOL_RESULTS_VISIBLE !== 'false'

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function fail(message, error) {
  console.error(message)
  if (error) console.error(error.message || error)
  process.exit(1)
}

const { data: existingSchool, error: schoolLookupError } = await supabase
  .from('schools')
  .select('*')
  .eq('name', schoolName)
  .maybeSingle()
if (schoolLookupError) fail('Could not look up the school.', schoolLookupError)

let school = existingSchool
if (!school) {
  const { data, error } = await supabase
    .from('schools')
    .insert({
      name: schoolName,
      contact_name: contactName,
      contact_email: contactEmail,
      results_visible: resultsVisible,
    })
    .select()
    .single()
  if (error) fail('Could not create the school.', error)
  school = data
  console.log(`Created school: ${school.name} (${school.id})`)
} else {
  console.log(`Using existing school: ${school.name} (${school.id})`)
}

// Profiles mirror auth.users, so the email is the reliable lookup.
const { data: existingProfile, error: profileLookupError } = await supabase
  .from('profiles')
  .select('id, email, role, full_name')
  .eq('email', adminEmail)
  .maybeSingle()
if (profileLookupError) fail('Could not look up the admin profile.', profileLookupError)

let userId = existingProfile?.id

if (userId) {
  if (existingProfile.role !== 'school_admin') {
    console.warn(`Note: ${adminEmail} currently has role "${existingProfile.role}". It will be changed to school_admin.`)
  }
  if (adminPassword) {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: adminPassword,
      user_metadata: { full_name: adminName },
    })
    if (error) fail('Could not update the existing admin password.', error)
    console.log('Updated the existing admin user and password.')
  } else {
    console.log('Using the existing admin user; password was not changed.')
  }
} else {
  if (!adminPassword) {
    fail('SCHOOL_ADMIN_PASSWORD is required when creating a new school admin.')
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { full_name: adminName },
  })
  if (error) fail('Could not create the school admin auth user.', error)
  userId = data.user.id
  console.log(`Created admin user: ${adminEmail} (${userId})`)
}

const { error: profileError } = await supabase
  .from('profiles')
  .update({ role: 'school_admin', full_name: adminName })
  .eq('id', userId)
if (profileError) fail('Could not set the school_admin profile role.', profileError)

const { error: memberError } = await supabase
  .from('school_members')
  .upsert({ user_id: userId, school_id: school.id, role: 'admin' }, { onConflict: 'user_id' })
if (memberError) fail('Could not link the admin to the school.', memberError)

console.log('\nSchool account ready.')
console.log(`  School: ${school.name}`)
console.log(`  School ID: ${school.id}`)
console.log(`  Admin email: ${adminEmail}`)
console.log(`  Scores visible to school: ${school.results_visible ? 'yes' : 'no'}`)
console.log('\nNext steps:')
console.log('  1. Sign in at /prize/auth with the admin email and password.')
console.log('  2. Use Import CSV on the school dashboard to load the student roster.')
console.log('  3. Confirm signed consent for each student before submitting poems.')
