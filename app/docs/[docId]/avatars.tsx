"use client";

import { Separator } from "@/components/ui/separator";
import { ClientSideSuspense } from "@liveblocks/react";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const AVATAR_SIZE = 36;

export const Avatars = () => {
  return (
    <ClientSideSuspense fallback={null}>
      <AvatarStack />
    </ClientSideSuspense>
  );
};

interface AvatarProps {
  src: string;
  name: string;
}

const Avatar = ({ name, src }: AvatarProps) => {
  return (
    <div
      className="group -ml-2 flex shrink-0 place-content-center relative border-4 rounded-full bg-muted"
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-xs z-10 text-background bg-foreground whitespace-nowrap transition-none">
        {name}
      </div>
      <img src={src} alt={name} className="size-full rounded-full" />
    </div>
  );
};

const AvatarStack = () => {
  const users = useOthers();
  const currentUser = useSelf();

  if (users.length === 0) return null;

  return (
    <>
      <div className="flex items-center">
        {currentUser && (
          <div className="relative ml-2">
            <Avatar src={currentUser.info.avatar} name="You" />
          </div>
        )}
        <div className="flex">
          {users.map(({ connectionId, info }) => {
            return (
              <Avatar key={connectionId} src={info.avatar} name={info.name} />
            );
          })}
        </div>
      </div>
      <Separator orientation="vertical" className="h-4" />
    </>
  );
};
