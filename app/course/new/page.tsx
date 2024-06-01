"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApiCreateCourseDraftHandler } from "@/dist/kubb";
import { CourseColorBadge } from "@/components/CourseColorBadge";
import { CourseColor } from "@/constants";
import { toast } from "sonner";

export default function CourseNew() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [color, setColor] = useState<CourseColor>("blue");

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setPrice(value >= 0 ? value : 0);
  };

  const createCourse = useApiCreateCourseDraftHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [{ url: "/api/course/get_created_courses" }],
        });
        toast("Курс успішно створено", {
          description: "Ви можете переглянути його в розділі 'Навчання'",
        });
        router.push("/teach");
      },
    },
  });

  function handleCourseCreate() {
    createCourse.mutate({
      data: { title, description, price, color, course_type: "" },
    });
  }

  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-primary-100 p-4 md:p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:p-8">
        <h1 className="mb-6 text-2xl font-bold">Створення курсу</h1>
        <section className="space-y-4">
          <div>
            <Label htmlFor="title">Назва</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="title"
                placeholder="Назва курсу"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              placeholder="Опис курсу"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="price">Ціна</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="price"
                type="number"
                placeholder="Ціна курсу"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
          </div>
          <div>
            <Label>Колір картки курсу</Label>
            <div className="flex flex-wrap gap-1">
              <CourseColorBadge
                color="blue"
                active={color == "blue"}
                onClick={() => {
                  setColor("blue");
                }}
              />
              <CourseColorBadge
                color="red"
                active={color == "red"}
                onClick={() => {
                  setColor("red");
                }}
              />
              <CourseColorBadge
                color="yellow"
                active={color == "yellow"}
                onClick={() => {
                  setColor("yellow");
                }}
              />
              <CourseColorBadge
                color="green"
                active={color == "green"}
                onClick={() => {
                  setColor("green");
                }}
              />
            </div>
          </div>
          <Button
            onClick={handleCourseCreate}
            variant={createCourse.isError ? "destructive" : "default"}
          >
            Створити курс
          </Button>
          {createCourse.isError && (
            <div className="text-sm font-medium text-red-500">
              Помилка при створенні курсу
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
