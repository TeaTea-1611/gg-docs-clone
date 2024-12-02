"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-rose-100 p-3 rounded-full">
            <AlertTriangleIcon className="size-10 text-rose-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p>{error.message}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={reset}>Try again</Button>
            <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
