"use client";

import { useParams } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonHeader } from "@/components/lesson/LessonHeader";

export default function LessonEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lesson: lessonId } = useParams<{ lesson: string }>();

  const lesson = {
    data: { title: "lesson", description: "lesson descipriotn" },
  };

  return (
    <div className="flex min-h-full flex-col">
      {lesson.data ? (
        <LessonHeader
          title={lesson.data.title}
          description={lesson.data.description}
          editable
        />
      ) : (
        <Skeleton className="h-[19.125rem] w-full" />
      )}
      {children}
      <Footer />
    </div>
  );
}
