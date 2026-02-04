type FeedFormProps = {
  nameInput: string;
  setName: (value: string) => void;
  contentInput: string;
  setContent: (value: string) => void;
  idFeed: number | null;
  updateFeed: () => void;
  simpanFeed: () => void;
  loading: boolean;
};
export default function FeedForm({
  nameInput,
  setName,
  contentInput,
  setContent,
  idFeed,
  updateFeed,
  simpanFeed,
  loading,
}: FeedFormProps) {
  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-full">
            {/* INPUT NAMA */}
            <input
              type="text"
              placeholder="Nama Samaran"
              value={nameInput}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            {/* TEXTAREA STATUS */}
            <textarea
              rows={3}
              value={contentInput}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Keluarin isi Unek-Unek lo?"
              className="w-full p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={idFeed ? updateFeed : simpanFeed}
                disabled={loading}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-lg
                        ${
                          loading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }
                      `}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : idFeed ? (
                  "Update"
                ) : (
                  "Posting"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
