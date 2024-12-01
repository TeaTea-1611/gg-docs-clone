"use client";

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { PaginationStatus } from "convex/react";
import { formatDate } from "date-fns";
import {
  Building2Icon,
  CircleUserIcon,
  ExternalLinkIcon,
  FilePenIcon,
  LoaderIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";

interface Props {
  docs: Doc<"documents">[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}

export const DocsTable = ({ docs, loadMore, status }: Props) => {
  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {docs === undefined ? (
        <div className="flex items-center justify-center h-24">
          <LoaderIcon className="animate-spin text-muted-foreground size-3" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell">Share</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length ? (
              docs.map((doc) => <DocRow key={doc._id} doc={doc} />)
            ) : (
              <TableRow>
                <TableCell>No documents found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <div className="flex items-center justify-center">
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "CanLoadMore" ? "Load more" : "End of result"}
        </Button>
      </div>
    </div>
  );
};

const DocRow = ({ doc }: { doc: Doc<"documents"> }) => {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/docs/${doc._id}`)}
    >
      <TableCell className="w-12">
        <SiGoogledocs className="fill-blue-500 size-5" />
      </TableCell>
      <TableCell className="font-medium">{doc.title}</TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        <div className="flex items-center gap-2">
          {doc.organizationId ? (
            <>
              <Building2Icon className="size-4" />
              Organization
            </>
          ) : (
            <>
              <CircleUserIcon className="size-4" />
              Personal
            </>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {formatDate(new Date(doc._creationTime), "MM dd/yyyy")}
      </TableCell>
      <TableCell className="flex ml-auto justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <RenameDialog docId={doc._id} title={doc.title}>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => e.preventDefault()}
              >
                <FilePenIcon className="size-4 mr-2" />
                Rename document
              </DropdownMenuItem>
            </RenameDialog>
            <RemoveDialog docId={doc._id}>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => e.preventDefault()}
              >
                <TrashIcon className="size-4 mr-2" />
                Remove document
              </DropdownMenuItem>
            </RemoveDialog>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/docs/${doc._id}`, "_blank");
              }}
            >
              <ExternalLinkIcon className="size-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
