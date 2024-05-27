"use client";

import { H1 } from "@/components/ui/typography";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CourseCard, CourseCardNew } from "@/components/CourseCard";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useApiGetCreatedCoursesHandler } from "@/dist/kubb";
import { CourseColor } from "@/constants";

export default function Teach() {
  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);

  const createdCourses = useApiGetCreatedCoursesHandler();
  useEffect(() => {
    console.log("createdCourses", createdCourses.data);
  }, [createdCourses]);

  return (
    <>
      {navLinksPortal
        ? createPortal(
            <>
              <span>Sublink</span>
              <span>Sublink</span>
              <span>Sublink</span>
            </>,
            navLinksPortal,
          )
        : null}
      <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
        <div className="flex flex-col justify-between gap-2 sm:flex-row">
          <H1>Creator cabinet</H1>
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
              href="/teach/course-id/lesson-id/task-uuid1"
            />
          ))}
          <CourseCardNew />
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </>
  );
}
