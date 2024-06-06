"use client";

import { useMemo } from "react";
import { LessonExercise } from "@/components/lesson/LessonExercise";
import {
  ExerciseCompletionPayload,
  ApiGetExercisesCompletionsHandlerQueryResponse,
  ApiGetLessonExercisesHandlerQueryResponse,
  useApiGetExercisesCompletionsHandler,
  useApiGetLessonExercisesHandler,
  useApiGetLessonProgressesHandler,
} from "@/dist/kubb";
import { useParams } from "next/navigation";
import { ExerciseCompletionServerState, ExerciseDifficulty } from "@/constants";
import { clsx } from "clsx";

type ExerciseProgressState =
  | ExerciseCompletionServerState
  | "NotStarted"
  | "Unavailable";

type ExerciseCompletionWithOrder = ExerciseCompletionPayload & {
  order: number;
};

function serverCompletionsToServerCompletionsWithOrder({
  serverCompletions,
  exercises,
}: {
  serverCompletions: ApiGetExercisesCompletionsHandlerQueryResponse;
  exercises: ApiGetLessonExercisesHandlerQueryResponse;
}): ExerciseCompletionWithOrder[] {
  return serverCompletions.map((c) => ({
    ...c,
    order:
      exercises.find((e) => e.exercise_id === c.exercise_id)?.exercise_order ||
      0,
  }));
}

function getCurrentExerciseState({
  serverStates,
  currentExerciseId,
  currentExerciseOrder,
}: {
  serverStates: ExerciseCompletionWithOrder[];
  currentExerciseId: number;
  currentExerciseOrder: number;
}): ExerciseProgressState {
  // Find the current exercise in the server states
  const currentExercise = serverStates.find(
    (exercise) => exercise.exercise_id === currentExerciseId,
  );

  // If the current exercise is found in the server states, return its state
  if (currentExercise) {
    return currentExercise.state as ExerciseCompletionServerState;
  }

  // Sort server states by order
  const sortedServerStates = serverStates.sort((a, b) => a.order - b.order);

  // Find the last done exercise and the first in-progress lesson
  const lastDoneExercise = sortedServerStates
    .filter((lesson) => lesson.state === "Done")
    .pop();
  const firstInProgressExercise = sortedServerStates.find(
    (exercise) => exercise.state === "InProgress",
  );

  // If there is an InProgress exercise, then there can't be a NotStarted exercise
  if (firstInProgressExercise) {
    return "Unavailable";
  }

  // If there are no progresses on the server
  if (serverStates.length === 0) {
    return currentExerciseOrder === 1 ? "NotStarted" : "Unavailable";
  }

  // If there are only Done exercises
  if (lastDoneExercise) {
    if (currentExerciseOrder === lastDoneExercise.order + 1) {
      return "NotStarted";
    } else if (currentExerciseOrder > lastDoneExercise.order + 1) {
      return "Unavailable";
    }
  }

  // If no specific conditions matched, default to Unavailable
  return "Unavailable";
}

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

  const exercises = useApiGetLessonExercisesHandler(parseInt(lessonId));

  const completions = useApiGetExercisesCompletionsHandler(parseInt(lessonId));

  const completionsWithOrder = useMemo(() => {
    if (!completions.data || !exercises.data) return [];
    return serverCompletionsToServerCompletionsWithOrder({
      serverCompletions: completions.data,
      exercises: exercises.data,
    });
  }, [completions.data, exercises.data]);
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
          {exercises.data
            ?.sort((a, b) => a.exercise_order - b.exercise_order)
            .map((exercise) => {
              const state = getCurrentExerciseState({
                serverStates: completionsWithOrder,
                currentExerciseId: exercise.exercise_id,
                currentExerciseOrder: exercise.exercise_order,
              });
              return (
                <LessonExercise
                  key={exercise.exercise_id}
                  lessonId={parseInt(lessonId)}
                  exerciseId={exercise.exercise_id}
                  exerciseOrder={exercise.exercise_order}
                  title={exercise.title}
                  description={exercise.description}
                  timeToComplete={exercise.time_to_complete || 0}
                  difficulty={exercise.difficult as ExerciseDifficulty}
                  intent={lessonStarted ? "learn" : "explore"}
                  btnLabel={clsx(
                    (state == "Succeeded" || state == "Failed") &&
                      "Переглянути",
                    state == "NotStarted" && "Почати",
                    state == "InProgress" && "Продовжити",
                    state == "Unavailable" && "Недоступно",
                  )}
                  href={
                    state == "Unavailable"
                      ? undefined
                      : `/learn/${courseId}/lesson/${lessonId}/exercise/${exercise.exercise_id}/answer`
                  }
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}
