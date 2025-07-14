import MainContent from "./components/MainContent";

export default function App() {
  return (
    <main>
      <section className="hero px-4">
        <div className="hero-content">
          <div className="sm:max-w-lg max-w-md">
            <h1 className="sm:text-5xl text-4xl font-black">Hi there!</h1>
            <p className="py-5 sm:text-lg text-[16px]">
              I'm Izha, and I'm so glad you stopped by my little corner of the
              internet. Want to get in touch? Just hit that contact button!
              <br />
              <span className="text-gray-400 text-sm">
                (Or you can just freely look around)
              </span>
            </p>
          </div>
        </div>
      </section>
      <MainContent />
    </main>
  );
}
