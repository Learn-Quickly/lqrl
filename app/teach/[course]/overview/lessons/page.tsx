"use client";

import { CreateLessonButton } from "@/components/lesson/CreateLessonButton";
import { useApiGetLessonsHandler } from "@/dist/kubb";
import { useParams } from "next/navigation";
import { CourseLesson } from "@/components/course/CourseLesson";

export default function Lessons() {
  const { course: courseId } = useParams<{ course: string }>();
  const lessons = useApiGetLessonsHandler(parseInt(courseId));
  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Уроки</h2>
            <p className="text-gray-500">
              Перегляд та управління уроками цього курсу.
            </p>
          </div>
          <CreateLessonButton />
        </div>
        <div className="grid gap-6">
          {lessons.data
            ?.sort((a, b) => a.lesson_order - b.lesson_order)
            .map((lesson) => (
              <CourseLesson
                key={lesson.id}
                courseId={parseInt(courseId)}
                lessonId={lesson.id}
                lessonOrder={lesson.lesson_order}
                title={lesson.title}
                description={lesson.description}
                intent="edit"
                isLast={lesson.lesson_order === lessons.data.length}
                href={`/teach/${courseId}/lesson/${lesson.id}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
