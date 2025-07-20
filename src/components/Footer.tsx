import Audio from "./Audio";

export default function Footer() {
  return (
    <footer className="bg-base-300 text-base-content  py-2 w-full fixed bottom-0">
      <div className="flex justify-between px-4 items-center">
        <h1 className="text-sm">Izha.</h1>
        <Audio />
      </div>
    </footer>
  );
}
