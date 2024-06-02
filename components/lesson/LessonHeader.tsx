"use client";

import { clsx } from "clsx";
import { ClipboardList, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export function LessonHeader({
  title,
  description,
  editable = false,
}: {
  title: string;
  description: string;
  editable?: boolean;
}) {
  const { lesson: lessonId } = useParams<{ lesson: string }>();

  return (
    <header className={clsx("w-full bg-stone-100 px-4 py-12 md:px-6 md:py-20")}>
      <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-gray-500 md:text-lg">{description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
          <ClipboardList className="h-4 w-4" />
          <span>12 завдань</span>
        </div>
        {editable && (
          <Button variant="outline" size="icon">
            <Pencil className="size-4" />
          </Button>
        )}
      </div>
    </header>
  );
}
