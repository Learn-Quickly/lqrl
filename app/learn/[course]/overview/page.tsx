"use client";

import { useMemo } from "react";
import {
  ApiGetLessonProgressesHandlerQueryResponse,
  LessonProgressPayload,
  ApiGetLessonsHandlerQueryResponse,
  useApiGetLessonProgressesHandler,
  useApiGetLessonsHandler,
} from "@/dist/kubb";
import { useParams } from "next/navigation";
import { CourseLesson } from "@/components/course/CourseLesson";
import { LessonProgressServerState } from "@/constants";
import { clsx } from "clsx";

type LessonProgressState =
  | LessonProgressServerState
  | "NotStarted"
  | "Unavailable";

type LessonProgressWithOrder = LessonProgressPayload & { order: number };

function serverProgressToServerProgressWithOrder({
  serverProgress,
  lessons,
}: {
  serverProgress: ApiGetLessonProgressesHandlerQueryResponse;
  lessons: ApiGetLessonsHandlerQueryResponse;
}): LessonProgressWithOrder[] {
  return serverProgress.map((progress) => ({
    ...progress,
    order:
      lessons.find((lesson) => lesson.id === progress.lesson_id)
        ?.lesson_order || 0,
  }));
}

function getCurrentLessonState({
  serverStates,
  currentLessonId,
  currentLessonOrder,
}: {
  serverStates: LessonProgressWithOrder[];
  currentLessonId: number;
  currentLessonOrder: number;
}): LessonProgressState {
  // Find the current lesson in the server states
  const currentLesson = serverStates.find(
    (lesson) => lesson.lesson_id === currentLessonId,
  );

  // If the current lesson is found in the server states, return its state
  if (currentLesson) {
    return currentLesson.state as LessonProgressServerState;
  }

  // Sort server states by order
  const sortedServerStates = serverStates.sort((a, b) => a.order - b.order);

  // Find the last done lesson and the first in-progress lesson
  const lastDoneLesson = sortedServerStates
    .filter((lesson) => lesson.state === "Done")
    .pop();
  const firstInProgressLesson = sortedServerStates.find(
    (lesson) => lesson.state === "InProgress",
  );

  // If there is an InProgress lesson, then there can't be a NotStarted lesson
  if (firstInProgressLesson) {
    return "Unavailable";
  }

  // If there are no progresses on the server
  if (serverStates.length === 0) {
    return currentLessonOrder === 1 ? "NotStarted" : "Unavailable";
  }

  // If there are only Done lessons
  if (lastDoneLesson) {
    if (currentLessonOrder === lastDoneLesson.order + 1) {
      return "NotStarted";
    } else if (currentLessonOrder > lastDoneLesson.order + 1) {
      return "Unavailable";
    }
  }

  // If no specific conditions matched, default to Unavailable
  return "Unavailable";
}

export default function LearnCourseLessons() {
  const { course: courseId } = useParams<{ course: string }>();
  const lessons = useApiGetLessonsHandler(parseInt(courseId));

  const progresses = useApiGetLessonProgressesHandler(
    { course_id: parseInt(courseId) },
    {},
  );

  const serverProgressWithOrder = useMemo(() => {
    return serverProgressToServerProgressWithOrder({
      serverProgress: progresses.data || [],
      lessons: lessons.data || [],
    });
  }, [progresses.data, lessons.data]);

  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Уроки</h2>
            <p className="text-gray-500">Перегляд та уроків цього курсу.</p>
          </div>
        </div>
        <div className="grid gap-6">
          {lessons.data
            ?.sort((a, b) => a.lesson_order - b.lesson_order)
            .map((lesson) => {
              const state = getCurrentLessonState({
                serverStates: serverProgressWithOrder,
                currentLessonId: lesson.id,
                currentLessonOrder: lesson.lesson_order,
              });

              return (
                <CourseLesson
                  key={lesson.id}
                  courseId={parseInt(courseId)}
                  lessonId={lesson.id}
                  lessonOrder={lesson.lesson_order}
                  title={lesson.title}
                  description={lesson.description}
                  intent="learn"
                  isLast={lesson.lesson_order === lessons.data.length}
                  btnLabel={clsx(
                    state == "Done" && "Виконано",
                    state == "NotStarted" && "Почати",
                    state == "InProgress" && "Продовжити",
                    state == "Unavailable" && "Недоступно",
                  )}
                  href={
                    state == "Unavailable"
                      ? "#"
                      : `/learn/${courseId}/lesson/${lesson.id}/overview`
                  }
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}
