export default function Brief() {
  return (
    <section className="pt-24">
      <div className="relative">
        {/* <picture>
          <source srcSet="/assets/zzz.avif" type="image/avif" />
          <source srcSet="/assets/zzz.webp" type="image/webp" />
          <img
            loading="lazy"
            src="/assets/zzz.gif"
            alt="cat who is sleeping"
            className="w-40 absolute -right-5.5 -top-25 z-20"
          />
        </picture> */}
        <img
          loading="lazy"
          src="/assets/zzz.gif"
          alt="cat who is sleeping"
          className="w-40 absolute -right-5.5 -top-25 z-20"
        />
        <div className="rounded-md bg-base-200 sm:w-lg px-4  py-5">
          <p className="p-5 text-lg text-center">
            " I code one line at the time "
          </p>
        </div>
      </div>
    </section>
  );
}
