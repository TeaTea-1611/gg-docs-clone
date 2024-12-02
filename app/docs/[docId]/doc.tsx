"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar";
import { api } from "@/convex/_generated/api";

interface Props {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
  docId: string;
}

export function Document({ preloadedDocument, docId }: Props) {
  const doc = usePreloadedQuery(preloadedDocument);

  return (
    <Room docId={docId}>
      <div className="min-h-screen">
        <div className="fixed inset-x-0 top-0 z-10 flex flex-col px-4 pt-2 gap-y-2 print:hidden bg-card h-[112px]">
          <Navbar doc={doc} />
          <Toolbar />
        </div>
        <div className="pt-[116px] print:p-0">
          <Editor initialContent={doc.initialContent} />
        </div>
      </div>
    </Room>
  );
}
