"use client";

import { useState } from "react";
import { H1 } from "@/components/ui/typography";
import { Pagination } from "@/components/Pagination";
import { CourseCard, CourseCardNotFound } from "@/components/CourseCard";
import { useApiGetCoursesHandler } from "@/dist/kubb";
import { CourseColor, paginationLimit } from "@/constants";
import { useSearchParams } from "next/navigation";
import { CoursesFilter } from "@/components/course/CoursesFilter";

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [courseFilter, setCourseFilter] = useState<string | undefined>();

  const courses = useApiGetCoursesHandler({
    filters: courseFilter,
    list_options: `{"limit": ${paginationLimit}, "offset": ${(page - 1) * paginationLimit}}`,
  });
  return (
    <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
      <div className="flex items-center justify-between gap-2">
        <H1>Пошук курсів</H1>
        <CoursesFilter setFilter={setCourseFilter} stateEq="Published" />
      </div>

      <div
        className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-1 lg:mb-0 lg:grid-cols-2 lg:text-left xl:grid-cols-3"
        style={{ gridAutoRows: "1fr" }}
      >
        {courses.data?.courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            color={course.color as CourseColor}
            price={course.price}
            intent="explore"
            href={`/explore/${course.id}`}
          />
        ))}
        {courses.data?.courses.length == 0 && <CourseCardNotFound />}
      </div>
      {courses.data && courses.data.count > paginationLimit && (
        <Pagination
          makeLink={(_page) => `/explore?page=${_page}`}
          currentPage={page}
          totalPages={Math.ceil(courses.data?.count / paginationLimit)}
        />
      )}
    </main>
  );
}
