import { Link } from "react-router"

export default function Nav() {
 return (
  <header className="flex justify-center mt-4">
   <nav >
    <ul className="flex gap-2 items-center font-mono">
     <li>
      <Link to={'/blog'} className="btn text-lg btn-link text-teal-400">Blogs</Link>
     </li>
     <li>
      <Link to={'/music'} className="btn text-lg btn-link text-teal-400">Music</Link>
     </li>
     <li >
      <Link to={'/'} className="btn text-lg btn-link text-teal-400">Home</Link>
     </li>
    </ul>
   </ nav>
  </header >
 )
}