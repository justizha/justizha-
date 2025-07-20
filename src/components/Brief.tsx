export default function Brief() {
  return (
    <section className="pt-5">
      <div className="relative">
        <div className="rounded-md bg-base-200 sm:w-lg px-4  py-5">
          <p className="p-5 text-lg text-center">
            "writing code one line at the time"
          </p>
          <img
            loading="lazy"
            src="/assets/catsleep.gif"
            alt="cat who is sleeping"
            className="w-14  absolute  -right-4 top-19"
          />
        </div>
      </div>
    </section>
  );
}
