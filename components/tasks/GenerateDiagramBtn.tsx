import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { generateDiagram } from "@/actions/generateDiagram";
import { useParams } from "next/navigation";
import { useApiGetCourseHandler, useApiGetLessonHandler } from "@/dist/kubb";
import { useDiagramStore } from "@/store/diagram";
import { clsx } from "clsx";

export function GenerateDiagramBtn() {
  const {
    course: courseId,
    lesson: lessonId,
    task: taskId,
  } = useParams<{ course: string; lesson: string; task: string }>();

  const course = useApiGetCourseHandler(parseInt(courseId));
  const lesson = useApiGetLessonHandler(parseInt(lessonId));

  const { setNodes, setEdges } = useDiagramStore.getState();
  const { exerciseName, exerciseDescription, answerNodes, answerEdges } =
    useDiagramStore((state) => ({
      exerciseName: state.diagrams[taskId]?.exerciseName,
      exerciseDescription: state.diagrams[taskId]?.exerciseDescription,
      answerNodes: state.diagrams[taskId]?.answer.nodes || [],
      answerEdges: state.diagrams[taskId]?.answer.edges || [],
    }));

  const [generating, setGenerating] = useState(false);

  async function handleGenerateDiagram() {
    if (course.data && lesson.data) {
      setGenerating(true);
      const diagram = await generateDiagram({
        courseName: course.data.title,
        courseDescription: course.data.description,
        lessonName: lesson.data.title,
        lessonDescription: lesson.data.description,
        taskId,
        taskName: exerciseName,
        taskDescription: exerciseDescription,
      });
      setGenerating(false);
      setNodes(taskId, "answer", diagram.nodes);
      setEdges(taskId, "answer", diagram.edges);
    }
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-white p-2">
      <Button
        variant="ghost"
        className={clsx(
          "flex size-16 flex-col gap-1",
          generating && "animate-pulse",
        )}
        onClick={handleGenerateDiagram}
        disabled={generating}
      >
        <Sparkles className="size-5" />
        <span className="text-xs">ШІ</span>
      </Button>
    </div>
  );
}
