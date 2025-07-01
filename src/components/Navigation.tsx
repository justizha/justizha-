import { Link } from "react-router"

export default function Nav() {
 return (
  <aside className="p-4">
   <nav className="p-2">
    <ul className="flex gap-2 items-center">
     <li className="">
      <Link to={'/'} className="btn btn-success btn-link">Home</Link>
     </li>
     <li>
      <Link to={'/'}>H</Link>
     </li>
     <li></li>
    </ul>
   </nav>
  </aside>
 )
}