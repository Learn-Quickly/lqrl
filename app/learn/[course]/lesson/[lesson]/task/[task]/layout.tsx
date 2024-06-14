"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  useApiCompleteAttemptHandler,
  useApiGetExerciseCompletionsHandler,
  useApiGetExerciseHandler,
  useApiStartExerciseHandler,
} from "@/dist/kubb";
import { useApiSaveChangesHandler } from "@/hooks/useApiSaveChangesHandler";
import { useQueryClient } from "@tanstack/react-query";
import {
  serverConnectionsToEdges,
  serverNodesToNodes,
  storeDiagramToRequestDiagram,
} from "@/lib/diagram";
import { DiagramNode, useDiagramStore } from "@/store/diagram";
import { toast } from "sonner";
import { secondsToMinutesAndSeconds } from "@/lib/utils";
import { Edge } from "reactflow";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const timerNotStarted = -1;

export default function SolutionLayout({
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
  const exercise = useApiGetExerciseHandler(parseInt(taskId));
  const completions = useApiGetExerciseCompletionsHandler(parseInt(taskId));

  const { setDisplayMode, setNodes, setEdges } = useDiagramStore.getState();

  const queryClient = useQueryClient();
  const startExercise = useApiStartExerciseHandler({
    mutation: {
      onSuccess: async () => {
        setDisplayMode(taskId, "solution", "view");
        await queryClient.invalidateQueries({
          queryKey: [
            {
              url: "/api/course/lesson/exercise/get_exercise_completions/:exercise_id",
              params: {
                exerciseId: parseInt(taskId),
              },
            },
          ],
        });
      },
    },
  });

  const saveChanges = useApiSaveChangesHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              url: "/api/course/lesson/exercise/get_exercises_completions/:lesson_id",
              params: {
                lessonId: parseInt(lessonId),
              },
            },
          ],
        });
      },
    },
  });

  const { solutionNodes, solutionEdges, displayMode } = useDiagramStore(
    (state) => ({
      solutionNodes: state.diagrams[taskId]?.solution.nodes || [],
      solutionEdges: state.diagrams[taskId]?.solution.edges || [],
      displayMode: state.diagrams[taskId]?.solution.displayMode || "hidden",
    }),
  );
  const saveChangesInterval = useRef<NodeJS.Timeout>();

  const completionInProgress = useMemo(() => {
    return completions.data?.find((c) => c.state === "InProgress");
  }, [completions.data]);

  const previousSolutionNodes = useRef<{ nodes: DiagramNode[]; edges: Edge[] }>(
    { nodes: [], edges: [] },
  );

  const handleSaveChanges = useCallback(() => {
    const currentBody = {
      nodes: solutionNodes,
      edges: solutionEdges,
    };

    const isEqual =
      JSON.stringify(currentBody) ===
      JSON.stringify(previousSolutionNodes.current);
    if (
      completionInProgress &&
      solutionNodes.length &&
      solutionEdges.length &&
      !isEqual
    ) {
      saveChanges.mutate({
        data: {
          exercise_completion_id: completionInProgress.exercise_completion_id,
          body: storeDiagramToRequestDiagram(currentBody),
        },
      });
      previousSolutionNodes.current = currentBody;
    }
  }, [completionInProgress, saveChanges, solutionEdges, solutionNodes]);

  const handleSaveChangesRef = useRef(handleSaveChanges);

  useEffect(() => {
    handleSaveChangesRef.current = handleSaveChanges;
  }, [handleSaveChanges]);

  const router = useRouter();
  const [completeResult, setCompleteResult] = useState("");
  const completeAttempt = useApiCompleteAttemptHandler({
    mutation: {
      onSuccess: async (res) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              {
                url: "/api/course/lesson/exercise/get_exercise_completions/:exercise_id",
                params: {
                  exerciseId: parseInt(taskId),
                },
              },
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              {
                url: "/api/course/lesson/exercise/get_exercises_completions/:lesson_id",
                params: {
                  lessonId: parseInt(lessonId),
                },
              },
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              {
                url: "/api/course/lesson/get_lesson_progresses",
                params: {
                  course_id: parseInt(courseId),
                },
              },
            ],
          }),
        ]);
        if (exercise.data?.difficult == "Read") {
          router.push(`/learn/${courseId}/lesson/${lessonId}/overview`);
        } else {
          setCompleteResult(`${Math.round(res.points)}/${res.max_points}`);
        }
        toast.success("Спробу завершено");
      },
    },
  });

  const handleCompleteAttempt = useCallback(async () => {
    handleSaveChangesRef.current();
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (completionInProgress) {
      completeAttempt.mutate({
        data: {
          exercise_completion_id: completionInProgress?.exercise_completion_id,
        },
      });
    } else {
      toast.error("Спроба не розпочата");
    }
  }, [completeAttempt, completionInProgress]);

  const timeLeftInterval = useRef<NodeJS.Timeout>();
  const [timeLeft, setTimeLeft] = useState(timerNotStarted);

  const timeIsUp = useRef(false);

  useEffect(() => {
    if (completions.data && taskId) {
      if (completionInProgress) {
        if (displayMode == "hidden") {
          setDisplayMode(taskId, "solution", "view");
          if (completionInProgress.body?.nodes) {
            setNodes(
              taskId,
              "solution",
              serverNodesToNodes(completionInProgress.body.nodes),
            );
          }
          if (completionInProgress.body?.connections) {
            setEdges(
              taskId,
              "solution",
              serverConnectionsToEdges({
                taskId,
                diagramVariant: "solution",
                connections: completionInProgress.body.connections,
              }),
            );
          }
        }

        if (
          exercise.data?.difficult != "Read" &&
          timeLeft === timerNotStarted
        ) {
          const dateStarted = completionInProgress.date_started;
          const currentDateSeconds = Math.floor(Date.now() / 1000);
          const timeToComplete = exercise.data?.time_to_complete || 0;
          const timeSpent = currentDateSeconds - dateStarted;
          const _timeLeft = timeToComplete - timeSpent;
          setTimeLeft(_timeLeft);

          if (!timeLeftInterval.current) {
            timeLeftInterval.current = setInterval(() => {
              setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft <= 0) {
                  timeIsUp.current = true;
                  clearInterval(saveChangesInterval.current);
                  clearInterval(timeLeftInterval.current);
                  return 0;
                }
                return prevTimeLeft - 1;
              });
            }, 1000);
          }
        }

        if (!saveChangesInterval.current) {
          saveChangesInterval.current = setInterval(() => {
            handleSaveChangesRef.current();
          }, 10000);
        }
      }
    }
  }, [
    timeLeft,
    completions.data,
    taskId,
    exercise.data,
    setDisplayMode,
    setEdges,
    setNodes,
    completionInProgress,
    displayMode,
  ]);

  useEffect(() => {
    return () => {
      if (saveChangesInterval.current) {
        clearInterval(saveChangesInterval.current);
      }
      if (timeLeftInterval.current) {
        clearInterval(timeLeftInterval.current);
      }
    };
  }, [saveChangesInterval, timeLeftInterval]);

  const { minutes, seconds } = secondsToMinutesAndSeconds(timeLeft);
  return (
    <div className="flex h-[calc(100dvh-4.5rem)] w-full flex-col md:h-dvh">
      <div className="flex items-center justify-between px-4 py-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/learn/${courseId}/lesson/${lessonId}/overview`}
            className="size-4"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        {exercise.data?.difficult != "Read" && timeLeft > timerNotStarted && (
          <span className="font-mono font-medium">
            {timeIsUp.current
              ? "Час вийшов"
              : `${minutes}:${seconds >= 10 ? seconds : "0" + seconds}`}
          </span>
        )}
        {!completionInProgress ? (
          <Button
            onClick={() => {
              startExercise.mutate({ data: { exercise_id: parseInt(taskId) } });
            }}
          >
            Почати спробу
          </Button>
        ) : (
          <Button onClick={handleCompleteAttempt}>Завершити спробу</Button>
        )}
      </div>
      {children}
      <Dialog
        open={!!completeResult}
        onOpenChange={(open) => {
          if (!open) {
            router.push(`/learn/${courseId}/lesson/${lessonId}/overview`);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Завдання пройдено</DialogTitle>
          </DialogHeader>
          <p className="text-center text-2xl font-bold text-primary-600">
            {completeResult}
          </p>
          <DialogFooter>
            <Button asChild>
              <Link href={`/learn/${courseId}/lesson/${lessonId}/overview`}>
                Продовжити
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
