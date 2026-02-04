type LimitModalProps = {
  show: boolean;
  message: string;
  onClose: () => void;
};

export default function LimitModal({
  show,
  message,
  onClose,
}: LimitModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-3 text-black">
          Limit Tercapai
        </h2>

        <p className="text-sm text-gray-700 mb-5">{message}</p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
