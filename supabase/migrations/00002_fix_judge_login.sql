-- Fix create_judge_user: add instance_id and raw_app_meta_data so GoTrue
-- recognizes email-password auth. Without these, signInWithPassword returns
-- "Invalid login credentials" even with the correct password.
--
-- instance_id must be 00000000-0000-0000-0000-000000000000 (not null)
-- raw_app_meta_data must be {"provider":"email","providers":["email"]}

CREATE OR REPLACE FUNCTION public.create_judge_user(judge_email text, judge_password text, judge_name text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
    declare
      new_id uuid;
    begin
      new_id := gen_random_uuid();

      insert into auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        raw_user_meta_data, raw_app_meta_data, aud, role,
        confirmation_token, recovery_token, email_change_token_new, email_change,
        created_at, updated_at
      )
      values (
        new_id,
        '00000000-0000-0000-0000-000000000000',
        judge_email,
        crypt(judge_password, gen_salt('bf')),
        now(),
        jsonb_build_object('role', 'judge', 'full_name', judge_name),
        jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
        'authenticated',
        'authenticated',
        '', '', '', '',
        now(),
        now()
      );

      return jsonb_build_object('id', new_id::text, 'email', judge_email);
    end;
    $function$;
