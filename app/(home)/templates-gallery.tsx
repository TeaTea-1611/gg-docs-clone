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
import { toast } from "sonner";

const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imgUrl: "/blank-document.svg",
    initialContent: "<p></p>", // Nội dung trống
  },
  {
    id: "software-proposal",
    label: "Software proposal",
    imgUrl: "/software-proposal.svg",
    initialContent: `
      <h1>Software Proposal</h1>
      <p>This is a template for a <strong>software proposal</strong>. Please customize it as needed.</p>
    `,
  },
  {
    id: "project-proposal",
    label: "Project-proposal",
    imgUrl: "/project-proposal.svg",
    initialContent: `
      <h1>Project Proposal</h1>
      <p>Start your project proposal here with an overview of your <em>project objectives</em>.</p>
    `,
  },
  {
    id: "business-letter",
    label: "Business letter",
    imgUrl: "/business-letter.svg",
    initialContent: `
      <p>Dear <strong>[Recipient Name]</strong>,</p>
      <p>[Your business letter content here...]</p>
      <p>Sincerely,<br>[Your Name]</p>
    `,
  },
  {
    id: "resume",
    label: "Resume",
    imgUrl: "/resume.svg",
    initialContent: `
      <h1>[Your Name]</h1>
      <p><strong>Contact Information:</strong> [Your Contact Details]</p>
      <h2>Experience</h2>
      <ul>
        <li>[Your work experience...]</li>
      </ul>
    `,
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imgUrl: "/cover-letter.svg",
    initialContent: `
      <p>Dear <strong>[Hiring Manager]</strong>,</p>
      <p>I am writing to express my interest in the <strong>[Position Name]</strong> position at <strong>[Company Name]</strong>...</p>
      <p>Sincerely,<br>[Your Name]</p>
    `,
  },
  {
    id: "letter",
    label: "letter",
    imgUrl: "/letter.svg",
    initialContent: `
      <p>Dear <strong>[Recipient]</strong>,</p>
      <p>[Your letter content here...]</p>
      <p>Best regards,<br>[Your Name]</p>
    `,
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
      .then(() => toast.success("Document created"))
      .catch(() => toast.error("Something went wrong"))
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
                    onClick={() =>
                      onTemplateOnclick(template.label, template.initialContent)
                    }
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
