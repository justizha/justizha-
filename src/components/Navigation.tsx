import { Link } from "react-router"

export default function Nav() {
 return (
  <aside className="rounded-lg border border-success p-3 py-2 absolute z-20 top-10 sm:left-80 left-2 ">
   <nav className="p-2">
    <ul>
     <li className="hover:scale-200 duration-200">
      <Link to={'/'} >H</Link>
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