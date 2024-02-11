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

export default function Teach() {
  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);

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
          <CourseCard
            title="Мнемотехніки Ведмедика Медика"
            description="Розвиток когнітивних навичок для дітей"
            color="red"
            users={217}
            price={0}
            intent="teach"
            href="/teach/course-id/lesson-id/task-uuid1"
          />
          <CourseCard
            title="Професійний розвиток вчителів"
            description="Вчимося навчати"
            color="yellow"
            users={14}
            price={27}
            intent="teach"
            href="/teach/course-id/lesson-id/task-uuid2"
          />
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
