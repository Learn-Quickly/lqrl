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

  // Find the last done lesson
  const lastDoneLesson = serverStates
    .filter((lesson) => lesson.state === "Done")
    .reduce((prev, curr) => (curr.order > prev.order ? curr : prev), {
      order: -1,
    });

  // Determine the state of the current lesson
  if (lastDoneLesson.order === -1) {
    // If there are no done lessons, the current lesson is NotStarted
    return "NotStarted";
  } else {
    // If there are done lessons, find the next lesson after the last done
    if (currentLessonOrder === lastDoneLesson.order + 1) {
      return "NotStarted";
    } else if (currentLessonOrder > lastDoneLesson.order + 1) {
      return "Unavailable";
    }
  }

  // If no specific conditions matched, default to NotStarted
  return "NotStarted";
}

export default function LearnCourseLessons() {
  const { course: courseId } = useParams<{ course: string }>();
  const lessons = useApiGetLessonsHandler(parseInt(courseId), {
    query: {
      refetchOnWindowFocus: false,
    },
  });

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
              console.log(state, lesson.id, lesson.lesson_order);
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
                      : `/learn/${courseId}/lesson/${lesson.id}`
                  }
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}
