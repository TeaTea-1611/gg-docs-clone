"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDebounce } from "@/hooks/use-debounce";
import { useStatus } from "@liveblocks/react";
import { useMutation } from "convex/react";
import { LoaderIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { toast } from "sonner";

interface Props {
  id: Id<"documents">;
  title: string;
}

export const DocInput = ({ id, title }: Props) => {
  const status = useStatus();

  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation(api.documents.updateById);

  const debounced = useDebounce(value, 1000);

  useEffect(() => {
    if (debounced !== value || title === value) {
      return;
    }
    setIsPending(true);
    mutation({ id, title: value })
      .then(() => toast.success("Updated"))
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsPending(false));
  }, [debounced, value, id, title, mutation]);

  const showLoader =
    isPending || status === "connecting" || status === "reconnecting";
  const showError = status === "disconnected";

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsPending(true);
            mutation({ id, title: value })
              .then(() => toast.success("Updated"))
              .catch(() => toast.error("Something went wrong"))
              .finally(() => setIsPending(false));
          }}
          className="relative w-fit max-w-[50ch]"
        >
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || " "}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onBlur={() => setIsEditing(false)}
            className="absolute inset-0 text-lg px-1.5 bg-transparent truncate"
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
          className="text-lg px-1.5"
        >
          {title}
        </span>
      )}
      {!showLoader && !showError && <BsCloudCheck className="size-4" />}
      {showError && <BsCloudSlash className="size-4" />}
      {showLoader && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
