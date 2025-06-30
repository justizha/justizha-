import Contact from "./Contanct"
import { Link } from "react-router"

export default function MainContent() {
 return (
  <section className="grid place-items-center w-full gap-4">
   <Contact />
   <Link className="btn btn-outline btn-warning sm:w-lg w-full text-lg" to={'/music'}>Music</Link>
  </section>
 )
}