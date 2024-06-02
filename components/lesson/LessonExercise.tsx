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
import { useApiExerciseChangeOrderHandler } from "@/dist/kubb";
import { useQueryClient } from "@tanstack/react-query";
import { ExerciseDifficulty } from "@/constants";
import { secondsToTime, translateExerciseDifficulty } from "@/lib/utils";

export function LessonExercise({
  lessonId,
  exerciseId,
  exerciseOrder,
  title,
  description,
  timeToComplete,
  difficulty,
  intent,
  href,
  isLast,
}: {
  lessonId: number;
  exerciseId: number;
  exerciseOrder: number;
  title: string;
  description: string;
  timeToComplete: number;
  difficulty: ExerciseDifficulty;
  intent: "learn" | "edit" | "explore";
  href?: string;
  isLast?: boolean;
}) {
  const queryClient = useQueryClient();

  const changeOrder = useApiExerciseChangeOrderHandler({
    mutation: {
      onSuccess: async () => {
        //TODO: invalidate exercises query
        // await queryClient.invalidateQueries({
        //   queryKey: [
        //     {
        //       params: { courseId: courseId },
        //       url: "/api/course/lesson/get_lessons/:course_id",
        //     },
        //   ],
        // });
      },
    },
  });

  async function handleMoveUp() {
    changeOrder.mutate({
      data: { exercise_id: exerciseId, order: exerciseOrder - 1 },
    });
  }

  async function handleMoveDown() {
    changeOrder.mutate({
      data: { exercise_id: exerciseId, order: exerciseOrder + 1 },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">
              Time to complete
            </p>
            <p className="text-base font-medium">
              {secondsToTime(timeToComplete)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Difficulty</p>
            <p className="text-base font-medium">
              {translateExerciseDifficulty(difficulty)}
            </p>
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
                disabled={exerciseOrder == 1}
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
