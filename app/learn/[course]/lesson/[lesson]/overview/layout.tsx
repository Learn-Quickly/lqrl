"use client";

import { useParams } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import {
  useApiGetLessonHandler,
  useApiGetLessonProgressesHandler,
} from "@/dist/kubb";

export default function LessonEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { course: courseId, lesson: lessonId } = useParams<{
    course: string;
    lesson: string;
  }>();
  const lesson = useApiGetLessonHandler(parseInt(lessonId));
  const progresses = useApiGetLessonProgressesHandler(
    { course_id: parseInt(courseId) },
    {},
  );
  const startable = !progresses.data?.find(
    (p) => p.lesson_id === parseInt(lessonId),
  );

  return (
    <div className="flex min-h-full flex-col">
      {lesson.data ? (
        <LessonHeader
          title={lesson.data.title}
          description={lesson.data.description}
          startable={startable}
        />
      ) : (
        <Skeleton className="h-[19.125rem] w-full" />
      )}
      {children}
      <Footer />
    </div>
  );
}
