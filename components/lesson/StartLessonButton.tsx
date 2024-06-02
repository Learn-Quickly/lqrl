import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useApiStartLessonHandler } from "@/dist/kubb";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function StartLessonButton() {
  const queryClient = useQueryClient();
  const { course: courseId, lesson: lessonId } = useParams<{
    course: string;
    lesson: string;
  }>();
  const startLesson = useApiStartLessonHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            { url: "/api/course/lesson/get_lesson_progresses" },
            { course_id: parseInt(courseId) },
          ],
        });
        toast.success("Урок успішно почато");
      },
    },
  });
  const handleStartLesson = () => {
    startLesson.mutate({ data: { lesson_id: parseInt(lessonId) } });
  };
  return (
    <Button variant="outline" size="sm" onClick={handleStartLesson}>
      Почати урок
    </Button>
  );
}
