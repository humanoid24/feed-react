import FeedCard, { Feed } from "./FeedCard";

type FeedListProps = {
  tampilFeed: Feed[];
  deviceId: string | null; // ✅ FIX
  pilihEdit: (feed: Feed) => void;
  setDeleteId: (id: number) => void;
  setShowDeleteModal: (show: boolean) => void;
};

export default function FeedList({
  tampilFeed,
  deviceId,
  pilihEdit,
  setDeleteId,
  setShowDeleteModal,
}: FeedListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tampilFeed.map((feeds) => (
        <FeedCard
          key={feeds.id}
          feeds={feeds}
          deviceId={deviceId}
          pilihEdit={pilihEdit}
          setDeleteId={setDeleteId}
          setShowDeleteModal={setShowDeleteModal}
        />
      ))}
    </div>
  );
}
