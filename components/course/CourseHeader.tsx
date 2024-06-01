"use client";

import { clsx } from "clsx";
import {
  BookCheck,
  CalendarDaysIcon,
  DollarSignIcon,
  UserIcon,
} from "lucide-react";
import { translateCourseState } from "@/lib/utils";
import { CourseColor, CourseState } from "@/constants";
import { Button } from "@/components/ui/button";
import { useApiRegisterForCourseHandler } from "@/dist/kubb";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export function CourseHeader({
  title,
  description,
  color,
  price,
  state,
  joinable = false,
}: {
  title: string;
  description: string;
  color: CourseColor;
  price: number;
  state?: CourseState;
  joinable?: boolean;
}) {
  const { course: courseId } = useParams<{ course: string }>();
  const router = useRouter();

  const registerForCourse = useApiRegisterForCourseHandler({
    mutation: {
      onSuccess: async () => {
        // TODO: invalidate joined courses query
        toast("Ви успішно приєднались до курсу");
        router.push(`/learn/${courseId}/`);
      },
    },
  });

  function handleRegisterForCourse() {
    registerForCourse.mutate({ data: { course_id: parseInt(courseId) } });
  }

  // TODO: if list of my courses contains this course, show "Ви вже приєднались"
  return (
    <header
      className={clsx(
        "w-full bg-gradient-to-b from-50% to-stone-100 px-4 py-12 md:px-6 md:py-20",
        color == "red" && "from-red-100",
        color == "yellow" && "from-yellow-100",
        color == "blue" && "from-blue-100",
        color == "green" && "from-green-100",
      )}
    >
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-gray-500 md:text-xl">{description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
          <CalendarDaysIcon className="h-4 w-4" />
          <span>12 уроків</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
          <DollarSignIcon className="h-4 w-4" />
          <span>{price > 0 ? price : "безкоштовно"}</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
          <UserIcon className="h-4 w-4" />
          <span>100 студентів</span>
        </div>
        {state && (
          <div className="inline-flex items-center gap-2 rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-sm font-medium">
            <BookCheck className="h-4 w-4" />
            <span>{translateCourseState(state || "Draft")}</span>
          </div>
        )}
        {joinable && (
          <Button variant="outline" size="sm" onClick={handleRegisterForCourse}>
            Приєднатися
          </Button>
        )}
      </div>
    </header>
  );
}
