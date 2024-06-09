"use client";

import { H1 } from "@/components/ui/typography";
import { CourseCard, CourseCardNew } from "@/components/CourseCard";
import { useApiGetCreatedCoursesHandler } from "@/dist/kubb";
import { CourseColor, paginationLimit } from "@/constants";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Pagination } from "@/components/Pagination";
import { CoursesFilter } from "@/components/course/CoursesFilter";

export default function Teach() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [courseFilter, setCourseFilter] = useState<string | undefined>();
  const createdCourses = useApiGetCreatedCoursesHandler(
    {
      filters: courseFilter,
      list_options: `{"limit": ${paginationLimit}, "offset": ${(page - 1) * paginationLimit}}`,
    },
    {},
  );

  return (
    <>
      <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <H1>Кабінет вчителя</H1>
          <CoursesFilter setFilter={setCourseFilter} />
        </div>

        <div
          className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-1 lg:mb-0 lg:grid-cols-2 lg:text-left xl:grid-cols-3"
          style={{ gridAutoRows: "1fr" }}
        >
          {createdCourses.data?.courses.map((course) => (
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
        {createdCourses.data && createdCourses.data.count > paginationLimit && (
          <Pagination
            makeLink={(_page) => `/teach?page=${_page}`}
            currentPage={page}
            totalPages={Math.ceil(createdCourses.data?.count / paginationLimit)}
          />
        )}
      </main>
    </>
  );
}
