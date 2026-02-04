type DeleteModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

export default function DeleteModal({
  show,
  onClose,
  onConfirm,
  loading,
}: DeleteModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h3 className="font-bold text-black mb-2">Hapus Postingan?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Postingan akan dihapus permanen dan tidak bisa dikembalikan.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded text-black disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

