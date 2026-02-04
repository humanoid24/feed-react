/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import FeedActions from "./FeedLike";
import { getDeviceId } from "@/lib/utils/device";

type Props = {
  feedId: number;
};

export default function FeedActionsClient({ feedId }: Props) {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  if (!deviceId) return null;

  return <FeedActions feedId={feedId} deviceId={deviceId} />;
}
