import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useApiLessonChangeOrderHandler } from "@/dist/kubb";
import { useQueryClient } from "@tanstack/react-query";

export function CourseLesson({
  courseId,
  lessonId,
  lessonOrder,
  title,
  description,
  intent,
  btnLabel,
  href,
  isLast,
}: {
  courseId: number;
  lessonId: number;
  lessonOrder: number;
  title: string;
  description: string;
  intent: "learn" | "edit" | "explore";
  btnLabel?: string;
  href?: string;
  isLast?: boolean;
}) {
  const queryClient = useQueryClient();

  const changeOrder = useApiLessonChangeOrderHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              params: { courseId: courseId },
              url: "/api/course/lesson/get_lessons/:course_id",
            },
          ],
        });
      },
    },
  });

  async function handleMoveUp() {
    changeOrder.mutate({
      data: { lesson_id: lessonId, order: lessonOrder - 1 },
    });
  }

  async function handleMoveDown() {
    changeOrder.mutate({
      data: { lesson_id: lessonId, order: lessonOrder + 1 },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="max-w-2xl">{description}</CardDescription>
      </CardHeader>
      {(intent == "learn" || intent == "edit") && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={href || "#"}>{btnLabel || "Перейти"}</Link>
          </Button>
          {intent == "edit" && (
            <>
              <Button
                size="icon"
                variant="ghost"
                disabled={lessonOrder == 1}
                onClick={handleMoveUp}
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                disabled={isLast}
                onClick={handleMoveDown}
              >
                <ArrowDown className="size-4" />
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
