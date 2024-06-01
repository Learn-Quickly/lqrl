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
import { useApiCreateLessonHandler } from "@/dist/kubb";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function CreateLessonButton() {
  const { course: courseId } = useParams<{ course: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();
  const createLesson = useApiCreateLessonHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              params: { courseId: parseInt(courseId) },
              url: "/api/course/lesson/get_lessons/:course_id",
            },
          ],
        });
      },
    },
  });

  function handleCreateLesson() {
    createLesson.mutate({
      data: { title, description, course_id: parseInt(courseId) },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Додати урок</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Додати урок</DialogTitle>
          <DialogDescription>
            Введіть назву та опис нового уроку.
          </DialogDescription>
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
          <Button type="submit" onClick={handleCreateLesson}>
            Додати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
