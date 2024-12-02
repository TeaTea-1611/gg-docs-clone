"use client";

import { usePaginatedQuery } from "convex/react";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";
import { api } from "@/convex/_generated/api";
import { DocsTable } from "./docs-table";
import { useSearchParam } from "@/hooks/use-search-param";

export default function Home() {
  const [search] = useSearchParam();

  const { results, loadMore, status } = usePaginatedQuery(
    api.documents.get,
    { search },
    { initialNumItems: 5 },
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-card px-2">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        <DocsTable docs={results} loadMore={loadMore} status={status} />
      </div>
    </div>
  );
}
