"use client";

import Link from "next/link";
import {
  DollarSignIcon,
  CalendarDaysIcon,
  UserIcon,
  BookCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { clsx } from "clsx";
import { useApiGetCourseHandler } from "@/dist/kubb";
import { translateCourseState } from "@/lib/utils";

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
      <header
        className={clsx(
          "w-full bg-gradient-to-b from-50% to-stone-100 px-4 py-12 md:px-6 md:py-20",
          course.data?.color == "red" && "from-red-100",
          course.data?.color == "yellow" && "from-yellow-100",
          course.data?.color == "blue" && "from-blue-100",
          course.data?.color == "green" && "from-green-100",
        )}
      >
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {course.data?.title}
        </h1>
        <p className="mt-4 text-gray-500 md:text-xl">
          {course.data?.description}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>12 уроків</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
            <DollarSignIcon className="h-4 w-4" />
            <span>
              {course.data?.price || 0 > 0 ? course.data?.price : "безкоштовно"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
            <UserIcon className="h-4 w-4" />
            <span>100 студентів</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
            <BookCheck className="h-4 w-4" />
            <span>{translateCourseState(course.data?.state || "Draft")}</span>
          </div>
        </div>
      </header>
      {children}
      <footer className="mt-auto flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 LQRL</p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
