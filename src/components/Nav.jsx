import styles from './Nav.module.css';
import {Link} from 'react-router-dom';


export default function Nav() {

  const links = [
    { text: 'Home', href: "/"},
    {text: "About" , href : "/about"},
    {text: "Key Dates" ,href : "/keydates"},
    {text :"How to Enter" , href : "/howtoenter"},
    {text : "Parents and Teachers" , href:"/parentandteachers"},
    {text: "Contact" , href: "/contact"}
  ]
  return (
      <nav  className={styles.nav}>
        <div className={styles.logo}></div>
        <div className={styles.navLink}>
        {
          links.map(
            (link) => (
              <Link key={link.href} to={link.href}>{link.text}</Link>
            )
          )
        }
        </div>
      </nav>
  );
}
