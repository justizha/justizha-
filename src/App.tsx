import MainContent from "./components/MainContent"

export default function App() {
  return (
    <main className="min-h-screen font-mono">
      <section className="hero pt-12">
        <div className="hero-content">
          <div className="max-w-lg">
            <h1 className="sm:text-5xl text-4xl font-black">Hi there!</h1>
            <p className="py-5 sm:text-lg text-[16px]">
               I'm Izha, and I'm so glad you stopped by my little corner of the internet. Want to get in touch? Just hit that contact button!
            </p>
          </div>
        </div>
      </section>
      <MainContent />
    </main>
  )
}
