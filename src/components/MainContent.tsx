import Contact from "./Contanct"
import Brief from "./Brief"
import { Link } from "react-router"

export default function MainContent() {
 return (
  <section className=" grid place-items-center px-3 gap-3 pb-4">
   <Contact />
   <Link
    className="btn btn-outline btn-warning sm:w-lg w-full text-lg"
    to={'/music'}>
    Music
   </Link>
   <Link
    className="btn btn-outline btn-info sm:w-lg w-full text-lg"
    to={'/blog'}>
    Blogs
   </Link>
   <Brief />
  </section>
 )
}