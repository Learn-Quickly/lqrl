"use client";

import { LessonExercise } from "@/components/lesson/LessonExercise";
import { useApiGetLessonProgressesHandler } from "@/dist/kubb";
import { useParams } from "next/navigation";

export default function LessonEditPage() {
  const { course: courseId, lesson: lessonId } = useParams<{
    course: string;
    lesson: string;
  }>();
  const progresses = useApiGetLessonProgressesHandler(
    { course_id: parseInt(courseId) },
    {},
  );
  const lessonStarted = !!progresses.data?.find(
    (p) => p.lesson_id === parseInt(lessonId),
  );
  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Вправи</h2>
            <p className="text-gray-500">Перегляд вправ цього уроку.</p>
          </div>
        </div>
        <div className="grid gap-6">
          <LessonExercise
            lessonId={0}
            exerciseId={0}
            exerciseOrder={1}
            title={"titl"}
            description={"desk"}
            timeToComplete={20}
            difficulty={"Easy"}
            intent={lessonStarted ? "learn" : "explore"}
            href={`#`}
          />
        </div>
      </div>
    </section>
  );
}
