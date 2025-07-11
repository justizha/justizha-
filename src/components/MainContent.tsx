import { Link } from "react-router";
import Brief from "./Brief";
import Contact from "./Contanct";

export default function MainContent() {
  return (
    <section className="grid place-items-center px-8 gap-3 pb-4">
      <Contact />
      <Link
        className="btn btn-outline btn-warning sm:w-lg w-full text-lg"
        to={"/music"}
      >
        Music
      </Link>
      <Link
        className="btn btn-outline btn-info sm:w-lg w-full text-lg"
        to={"/blog"}
      >
        Blogs
      </Link>
      <Brief />
    </section>
  );
}
