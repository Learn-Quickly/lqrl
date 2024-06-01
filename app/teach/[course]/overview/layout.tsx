"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useApiGetAttendants, useApiGetCourseHandler } from "@/dist/kubb";
import { Footer } from "@/components/Footer";
import { CourseHeader } from "@/components/course/CourseHeader";
import { CourseColor } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { course: courseId } = useParams<{ course: string }>();
  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);

  const course = useApiGetCourseHandler(parseInt(courseId));

  const attendants = useApiGetAttendants({ course_id: parseInt(courseId) });

  return (
    <div className="flex min-h-full flex-col">
      {navLinksPortal
        ? createPortal(
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit self-end"
                asChild
              >
                <Link href={`/teach/${courseId}/overview/lessons`}>Уроки</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit self-end"
                asChild
              >
                <Link href={`/teach/${courseId}/overview/attendees`}>Учні</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit self-end"
                asChild
              >
                <Link href={`/teach/${courseId}/overview/settings`}>
                  Налаштування
                </Link>
              </Button>
            </>,
            navLinksPortal,
          )
        : null}
      {course.data ? (
        <CourseHeader
          title={course.data.title}
          description={course.data.description}
          color={course.data.color as CourseColor}
          price={course.data.price}
          state={course.data.state}
          attendants={attendants.data?.length}
        />
      ) : (
        <Skeleton className="h-[19.125rem] w-full" />
      )}
      {children}
      <Footer />
    </div>
  );
}
