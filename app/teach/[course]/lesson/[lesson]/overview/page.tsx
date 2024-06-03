"use client";

import { LessonExercise } from "@/components/lesson/LessonExercise";
import { useParams } from "next/navigation";

export default function LessonEditPage() {
  const { course, lesson } = useParams<{ course: string; lesson: string }>();
  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Вправи</h2>
            <p className="text-gray-500">
              Перегляд та управління вправами цього уроку.
            </p>
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
            intent="edit"
            href={`/teach/${course}/lesson/${lesson}/task/0/answer`}
          />
        </div>
      </div>
    </section>
  );
}
