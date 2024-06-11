"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BookOpenText, NotebookPen, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExerciseDifficulty } from "@/constants";
import {
  secondsToMinutesAndSeconds,
  translateExerciseDifficulty,
} from "@/lib/utils";
import { clsx } from "clsx";
import { DiagramVariant, useDiagramStore } from "@/store/diagram";
import { useApiCreateExerciseHandler } from "@/hooks/useApiCreateExerciseHandler";
import { toast } from "sonner";
import { useApiGetExerciseHandler } from "@/dist/kubb";
import { useQueryClient } from "@tanstack/react-query";
import { storeDiagramToRequestDiagram } from "@/lib/diagram";

export default function EditTaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    course: courseId,
    lesson: lessonId,
    task: taskId,
  } = useParams<{
    course: string;
    lesson: string;
    task: string;
  }>();
  const router = useRouter();
  const isNew = taskId === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>("Easy");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const exercise = useApiGetExerciseHandler(parseInt(taskId));

  useEffect(() => {
    if (exercise.data) {
      setTitle(exercise.data.title);
      setDescription(exercise.data.description);
      setDifficulty(exercise.data.difficult as ExerciseDifficulty);
      if (exercise.data.time_to_complete) {
        const { minutes, seconds } = secondsToMinutesAndSeconds(
          exercise.data.time_to_complete,
        );
        setMinutes(minutes.toString());
        setSeconds(seconds.toString());
      }
    }
  }, [exercise.data]);

  const handleSetMinutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinutes(value < 0 ? "0" : e.target.value);
  };

  const handleSetSeconds = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value < 0) {
      setSeconds("0");
    } else if (value > 59) {
      setSeconds("59");
    } else {
      setSeconds(e.target.value);
    }
  };

  const pathname = usePathname();
  const openedDiagram: DiagramVariant = pathname.includes("answer")
    ? "answer"
    : "exercise";

  const queryClient = useQueryClient();
  const createExercise = useApiCreateExerciseHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              url: "/api/course/lesson/exercise/get_lesson_exercises/:lesson_id",
              params: { lessonId: parseInt(lessonId) },
            },
          ],
        });
        toast.success("Вправу успішно створено");
        router.push(`/teach/${courseId}/lesson/${lessonId}/overview`);
      },
    },
  });

  const { nodes, edges } = useDiagramStore((state) => ({
    nodes: state.diagrams[taskId]?.[openedDiagram].nodes || [],
    edges: state.diagrams[taskId]?.[openedDiagram].edges || [],
  }));

  function handleCreateExercise() {
    const valueBody = storeDiagramToRequestDiagram({ nodes, edges });
    createExercise.mutate({
      data: {
        title,
        description,
        difficult: difficulty,
        time_to_complete: parseInt(minutes) * 60 + parseInt(seconds),
        lesson_id: parseInt(lessonId),
        exercise_type:
          difficulty == "Read" ? "Conspect" : "InteractiveConspect",
        answer_body: valueBody,
        exercise_body: valueBody,
      },
    });
  }

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] w-full flex-col md:h-dvh">
      <div className="flex items-center justify-between px-4 py-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/teach/${courseId}/lesson/${lessonId}/overview`}
            className="size-4"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        {difficulty != "Read" && (
          <div className="flex h-fit w-fit justify-center gap-2 self-center rounded-md bg-primary-300 p-1.5">
            <Button
              size="sm"
              className={openedDiagram == "answer" ? "sm:w-28" : ""}
              variant={openedDiagram == "exercise" ? "ghost" : "default"}
              asChild
            >
              <Link
                href={`/teach/${courseId}/lesson/${lessonId}/task/${taskId}/answer`}
              >
                <BookOpenText
                  className={clsx(
                    "size-4",
                    openedDiagram == "answer" && "sm:mr-2",
                  )}
                />
                {openedDiagram == "answer" && (
                  <span className="hidden sm:inline">Відповідь</span>
                )}
              </Link>
            </Button>
            <Button
              size="sm"
              className={openedDiagram == "exercise" ? "sm:w-28" : ""}
              variant={openedDiagram == "exercise" ? "default" : "ghost"}
              asChild
            >
              <Link
                href={`/teach/${courseId}/lesson/${lessonId}/task/${taskId}/exercise`}
              >
                <NotebookPen
                  className={clsx(
                    "size-4",
                    openedDiagram == "exercise" && "sm:mr-2",
                  )}
                />
                {openedDiagram == "exercise" && (
                  <span className="hidden sm:inline">Завдання</span>
                )}
              </Link>
            </Button>
          </div>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <Settings className="mr-2 size-4" />
              Налаштування
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Налаштування вправи</DialogTitle>
              <DialogDescription>
                Змініть назву, опис, складність вправи та час на виконання.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-name" className="text-right">
                  Назва
                </Label>
                <Input
                  id="task-name"
                  placeholder="Введіть назву вправи"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-description" className="text-right">
                  Опис
                </Label>
                <Textarea
                  id="task-description"
                  placeholder="Введіть опис вправи"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-difficulty" className="text-right">
                  Складність
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      id="task-difficulty"
                      size="sm"
                      className="w-fit"
                    >
                      {translateExerciseDifficulty(difficulty)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      Оберіть складність вправи
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={difficulty == "Read"}
                      onClick={() => setDifficulty("Read")}
                    >
                      {translateExerciseDifficulty("Read")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={difficulty == "Easy"}
                      onClick={() => setDifficulty("Easy")}
                    >
                      {translateExerciseDifficulty("Easy")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={difficulty == "Medium"}
                      onClick={() => setDifficulty("Medium")}
                    >
                      {translateExerciseDifficulty("Medium")}
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={difficulty == "Hard"}
                      onClick={() => setDifficulty("Hard")}
                    >
                      {translateExerciseDifficulty("Hard")}
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {difficulty != "Read" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-time" className="text-right">
                    Час на виконання
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="task-time-minutes"
                      placeholder="Хвилини"
                      type="number"
                      value={minutes}
                      onChange={handleSetMinutes}
                    />
                    <span>:</span>
                    <Input
                      id="task-time-seconds"
                      type="number"
                      placeholder="Секунди"
                      value={seconds}
                      onChange={handleSetSeconds}
                    />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateExercise}>
                {isNew ? "Створити" : "Зберегти"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {children}
    </div>
  );
}
