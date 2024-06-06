"use client";

import { LessonExercise } from "@/components/lesson/LessonExercise";
import { useParams } from "next/navigation";
import { useApiGetLessonExercisesHandler } from "@/dist/kubb";
import { ExerciseDifficulty } from "@/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LessonEditPage() {
  const { course: courseId, lesson: lessonId } = useParams<{
    course: string;
    lesson: string;
  }>();
  const exercises = useApiGetLessonExercisesHandler(parseInt(lessonId));
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
          <Button variant="outline" asChild>
            <Link
              href={`/teach/${courseId}/lesson/${lessonId}/task/new/answer`}
            >
              Додати вправу
            </Link>
          </Button>
        </div>
        <div className="grid gap-6">
          {exercises.data?.map((exercise) => (
            <LessonExercise
              key={exercise.exercise_id}
              lessonId={parseInt(lessonId)}
              exerciseId={exercise.exercise_id}
              exerciseOrder={exercise.exercise_order}
              title={exercise.title}
              description={exercise.description}
              timeToComplete={exercise.time_to_complete || 0}
              difficulty={exercise.difficult as ExerciseDifficulty}
              intent="edit"
              btnLabel="Редагувати"
              href={`/teach/${courseId}/lesson/${lessonId}/task/${exercise.exercise_id}/answer`}
              isLast={exercise.exercise_order === exercises.data.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
