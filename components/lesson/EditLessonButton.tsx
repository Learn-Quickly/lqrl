"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApiUpdateLessonHandler } from "@/dist/kubb";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

export function EditLessonButton({
  title: initialTitle,
  description: initialDescription,
}: {
  title: string;
  description: string;
}) {
  const { lesson: lessonId } = useParams<{ lesson: string }>();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const queryClient = useQueryClient();
  const updateLesson = useApiUpdateLessonHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              url: "/api/course/lesson/get_lesson/:lesson_id",
              params: {
                lessonId: parseInt(lessonId),
              },
            },
          ],
        });
        toast.success("Урок успішно оновлено");
      },
    },
  });

  function handleUpdateLesson() {
    //TODO: update description when API is ready
    updateLesson.mutate({
      data: { title, lesson_id: parseInt(lessonId) },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редагування уроку</DialogTitle>
          <DialogDescription>Введіть назву та опис уроку</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-lesson-name" className="text-right">
              Назва
            </Label>
            <Input
              id="new-lesson-name"
              placeholder="Введіть назву уроку"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-lesson-description" className="text-right">
              Опис
            </Label>
            <Textarea
              id="new-lesson-description"
              placeholder="Введіть опис уроку"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdateLesson}>
            Зберегти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
