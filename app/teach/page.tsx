"use client";

import { H1 } from "@/components/ui/typography";
import { CourseCard, CourseCardNew } from "@/components/CourseCard";
import { useApiGetCreatedCoursesHandler } from "@/dist/kubb";
import { CourseColor } from "@/constants";

export default function Teach() {
  const createdCourses = useApiGetCreatedCoursesHandler({
    query: {
      refetchOnMount: true,
    },
  });

  return (
    <>
      <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <H1>Кабінет творця</H1>
        </div>

        <div
          className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-1 lg:mb-0 lg:grid-cols-2 lg:text-left xl:grid-cols-3"
          style={{ gridAutoRows: "1fr" }}
        >
          {createdCourses.data?.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              description={course.description}
              color={course.color as CourseColor}
              state={course.state}
              price={course.price}
              intent="teach"
              href={`/teach/${course.id}/overview/lessons`}
            />
          ))}
          <CourseCardNew />
        </div>
      </main>
    </>
  );
}
