import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useFetchPhotos } from "../hooks/useFetchPhotos";
import { favouritesReducer } from "../reducers/favouritesReducer";

const Gallery = () => {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState("");

  const [favourites, dispatch] = useReducer(favouritesReducer, [], () => {
    try {
      const savedFavourites = localStorage.getItem("favourites");
      return savedFavourites ? JSON.parse(savedFavourites) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query),
    );
  }, [photos, search]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-gray-500">
          Loading beautiful photos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="rounded-xl border border-red-100 bg-red-50 px-6 py-4 text-center text-sm text-red-600">
          Failed to load photos: {error}
        </p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-gray-700">No photos available</p>
        <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search photos by author..."
            value={search}
            onChange={handleSearch}
            aria-label="Search photos by author"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <p className="text-sm font-medium text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredPhotos.length}
          </span>{" "}
          of {photos.length} photos
        </p>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-800">No photos found</p>
          <p className="mt-2 text-sm text-gray-500">
            Try searching with a different author's name.
          </p>

          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPhotos.map((photo) => {
            const isFavourite = favourites.some((item) => item.id === photo.id);

            return (
              <div
                key={photo.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <img
                    src={`https://picsum.photos/id/${photo.id}/500/350`}
                    alt={`Photo by ${photo.author}`}
                    loading="lazy"
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 p-4">
                  <p className="truncate font-medium text-gray-800">
                    {photo.author}
                  </p>

                  <button
                    type="button"
                    aria-label={
                      isFavourite
                        ? `Remove ${photo.author} from favourites`
                        : `Add ${photo.author} to favourites`
                    }
                    aria-pressed={isFavourite}
                    onClick={() =>
                      dispatch({
                        type: "TOGGLE_FAVOURITE",
                        payload: photo,
                      })
                    }
                    className={`cursor-pointer text-4xl transition-transform duration-200 hover:scale-125 ${
                      isFavourite
                        ? "text-red-500"
                        : "text-gray-300 hover:text-red-400"
                    }`}
                  >
                    {isFavourite ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Gallery;
