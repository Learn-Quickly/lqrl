"use client";

import { useParams } from "next/navigation";
import { useApiGetCourseHandler } from "@/dist/kubb";
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

  const course = useApiGetCourseHandler(parseInt(courseId));

  return (
    <div className="flex min-h-full flex-col">
      {course.data ? (
        <CourseHeader
          title={course.data.title}
          description={course.data.description}
          color={course.data.color as CourseColor}
          price={course.data.price}
          imgSrc={course.data.img_url || undefined}
          joinable
        />
      ) : (
        <Skeleton className="h-[19.125rem] w-full" />
      )}
      {children}
      <Footer />
    </div>
  );
}
