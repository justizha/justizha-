export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8shadow-md-b-2shadow-md-gray-900 mx-auto" />
        <img
          src="/assets/rollingcar.gif"
          alt="cat"
          className="w-20"
          loading="lazy"
        />
      </div>
    </div>
  );
}
