import { Link } from "react-router";
import Brief from "./Brief";
import Contact from "./Contanct";

export default function MainContent() {
  return (
    <section className="grid place-items-center px-8 gap-3 rounded-none">
      <Contact />
      <Link
        className="btn btn-outline btn-accent  sm:w-lg w-full text-lg rounded-none"
        to={"/music"}
      >
        Music
      </Link>
      <Link
        className="btn btn-outline btn-accent sm:w-lg w-full text-lg rounded-none"
        to={"/blog"}
      >
        Blogs
      </Link>
      <Brief />
    </section>
  );
}
