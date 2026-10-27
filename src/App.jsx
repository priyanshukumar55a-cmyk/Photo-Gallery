import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Photo Gallery
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Discover beautiful photographs from around the world.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Gallery />
      </main>
    </div>
  );
}

export default App;
