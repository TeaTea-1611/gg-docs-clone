import { Id } from "@/convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { Document } from "./doc";
import { api } from "@/convex/_generated/api";
interface Props {
  params: Promise<{ docId: Id<"documents"> }>;
}

export default async function Page({ params }: Props) {
  const { docId } = await params;

  const { getToken } = await auth();

  const token = (await getToken({ template: "convex" })) ?? undefined;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const preloadedDoc = await preloadQuery(
    api.documents.getById,
    { id: docId },
    { token },
  );

  return <Document docId={docId} preloadedDocument={preloadedDoc} />;
}
