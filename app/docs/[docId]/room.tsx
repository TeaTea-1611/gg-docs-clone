"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getDocs, getUsers } from "./actions";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

type User = { id: string; name: string; avatar: string };

export function Room({
  docId,
  children,
}: {
  docId: string;
  children: ReactNode;
}) {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    },
    [],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      throttle={16}
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ room: docId }),
        });

        return await response.json();
      }}
      resolveUsers={({ userIds }) =>
        userIds.map((userId) => users.find((user) => user.id === userId))
      }
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase()),
          );
        }
        return filteredUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const docs = await getDocs(roomIds as Id<"documents">[]);
        return docs.map((doc) => ({
          id: doc.id,
          name: doc.name,
        }));
      }}
    >
      <RoomProvider
        id={docId}
        initialStorage={{ leftMargin: 56, rightMargin: 56 }}
      >
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room loading..." />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
