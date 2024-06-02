"use client";

import { useEffect, useState } from "react";
import { H1 } from "@/components/ui/typography";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { CourseCard, CourseCardNotFound } from "@/components/CourseCard";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CoursesFilter } from "@/components/course/CoursesFilter";
import { useApiGetUserCoursesRegisteredHandler } from "@/dist/kubb";
import { CourseColor, paginationLimit } from "@/constants";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [courseFilter, setCourseFilter] = useState<string | undefined>();

  const courses = useApiGetUserCoursesRegisteredHandler({
    filters: courseFilter,
    list_options: `{"limit": ${paginationLimit}, "offset": ${(page - 1) * paginationLimit}}`,
  });
  return (
    <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
      {navLinksPortal
        ? createPortal(
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit self-end"
                asChild
              >
                <Link href="/explore">Пошук курсів</Link>
              </Button>
            </>,
            navLinksPortal,
          )
        : null}
      <div className="flex items-center justify-between gap-2">
        <H1>Мої курси</H1>
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
            intent="learn"
            href={`/learn/${course.id}/overview`}
          />
        ))}
        {courses.data?.courses.length == 0 && <CourseCardNotFound />}
      </div>
      {courses.data && courses.data.count > paginationLimit && (
        <Pagination
          makeLink={(_page) => `/?page=${_page}`}
          currentPage={page}
          totalPages={Math.ceil(courses.data?.count / paginationLimit)}
        />
      )}
    </main>
  );
}
