import {
  Card,
  CardContent,
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
  intent,
  href,
  isLast,
}: {
  courseId: number;
  lessonId: number;
  lessonOrder: number;
  title: string;
  intent: "learn" | "edit" | "explore";
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
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p className="text-base font-medium">2 exercises</p>
          </div>
        </div>
      </CardContent>
      {(intent == "learn" || intent == "edit") && (
        <CardFooter className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={href || "#"}>
              {intent == "edit" ? "Редагувати" : "Переглянути"}
            </Link>
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
