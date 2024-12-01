"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imgUrl: "/blank-document.svg",
  },
  {
    id: "software-proposal",
    label: "Software proposal",
    imgUrl: "/software-proposal.svg",
  },
  {
    id: "project-proposal",
    label: "Project-proposal",
    imgUrl: "/project-proposal.svg",
  },
  {
    id: "business-letter",
    label: "Business letter",
    imgUrl: "/business-letter.svg",
  },
  {
    id: "resume",
    label: "Resume",
    imgUrl: "/resume.svg",
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imgUrl: "/cover-letter.svg",
  },
  {
    id: "letter",
    label: "letter",
    imgUrl: "/letter.svg",
  },
];

export const TemplatesGallery = () => {
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const [isCreating, setIsCreating] = useState(false);

  const onTemplateOnclick = (title: string, initialContent: string) => {
    setIsCreating(true);
    create({
      title,
      initialContent,
    })
      .then((docId) => router.push(`/docs/${docId}`))
      .finally(() => setIsCreating(false));
  };

  return (
    <div className="bg-muted">
      <div className="flex flex-col max-w-screen-xl px-16 py-6 mx-auto space-y-4">
        <h3 className="font-semibold">Start new document</h3>
        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
              >
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5",
                    isCreating && "pointer-events-none opacity-50",
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() => onTemplateOnclick(template.label, "")}
                    className="bg-cover bg-center bg-no-repeat size-full hover:border-blue-500 rounded-sm border hover:bg-accent transform flex flex-col justify-center gap-y-4 bg-card"
                    style={{
                      backgroundImage: `url(${template.imgUrl})`,
                    }}
                  ></button>
                  <p className="text-sm font-medium truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};