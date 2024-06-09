"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseColorBadge } from "@/components/CourseColorBadge";
import {
  useApiArchiveCourseHandler,
  useApiGetCourseHandler,
  useApiPublishCourseHandler,
  useApiUpdateCourseHandler,
} from "@/dist/kubb";
import { useApiSetCourseImgHandler } from "@/hooks/useApiSetCourseImgHandler";
import { useParams, useRouter } from "next/navigation";
import { CourseColor } from "@/constants";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

const isAllowedExtension = (file: any) => {
  const allowedExtensions = [".png"];
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return allowedExtensions.includes(ext);
};

export default function CourseSettings() {
  const { course: courseId } = useParams<{ course: string }>();
  const route = useRouter();
  const course = useApiGetCourseHandler(parseInt(courseId));
  const [title, setTitle] = useState(course.data?.title || "");
  const [description, setDescription] = useState(
    course.data?.description || "",
  );
  const [price, setPrice] = useState(course.data?.price || 0);
  const [color, setColor] = useState<CourseColor>(
    (course.data?.color as CourseColor) || "blue",
  );

  useEffect(() => {
    if (course.data) {
      setTitle(course.data.title);
      setDescription(course.data.description);
      setPrice(course.data.price);
      setColor(course.data.color as CourseColor);
    }
  }, [course.data]);

  const queryClient = useQueryClient();
  const updateCourse = useApiUpdateCourseHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              params: { courseId: parseInt(courseId) },
              url: "/api/course/get_course/:course_id",
            },
          ],
        });
        toast.success("Курс успішно оновлено", {
          description: "Зміни були збережені.",
        });
      },
    },
  });

  function handleCourseUpdate() {
    updateCourse.mutate({
      data: { id: parseInt(courseId), title, description, price, color },
    });
  }

  const setCourseImg = useApiSetCourseImgHandler({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            {
              params: { courseId: parseInt(courseId) },
              url: "/api/course/get_course/:course_id",
            },
          ],
        });
        toast.success("Зображення курсу успішно змінено");
      },
    },
  });

  const archiveCourse = useApiArchiveCourseHandler({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              {
                params: { courseId: parseInt(courseId) },
                url: "/api/course/get_course/:course_id",
              },
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              {
                url: "/api/course/get_created_courses",
              },
            ],
          }),
        ]);
        toast.success("Курс успішно архівовано", {
          description: "Курс більше не доступний для студентів.",
          action: {
            label: "Переглянути",
            onClick: () => {
              route.push(`/teach/${courseId}/overview/lessons`);
            },
          },
        });
      },
    },
  });

  const publishCourse = useApiPublishCourseHandler({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [
              {
                params: { courseId: parseInt(courseId) },
                url: "/api/course/get_course/:course_id",
              },
            ],
          }),
          queryClient.invalidateQueries({
            queryKey: [
              {
                url: "/api/course/get_created_courses",
              },
            ],
          }),
        ]);
        toast.success("Курс успішно опубліковано", {
          description: "Курс став доступним для студентів.",
          action: {
            label: "Переглянути",
            onClick: () => {
              route.push(`/teach/${courseId}/overview/lessons`);
            },
          },
        });
      },
    },
  });

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;

    const validFiles = Array.from(files).filter(isAllowedExtension);

    const formData = new FormData();
    formData.append("image", validFiles[0]);

    setCourseImg.mutate({
      courseId: parseInt(courseId),
      data: formData,
    });
  }

  return (
    <section className="flex w-full flex-col gap-8 border-t py-12">
      <div className="px-4 md:px-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">Налаштування курсу</h2>
            <p className="mt-2 text-primary-500">
              Налаштуйте параметри цього курсу.
            </p>
          </div>
          <Button onClick={handleCourseUpdate}>Зберегти</Button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="title">Назва</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Назва курсу"
              id="title"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опис курсу"
              id="description"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="price">Ціна</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              placeholder="Ціна курсу"
              id="price"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="price">Колір</Label>
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
        </div>
      </div>
      <div className="px-4 md:px-6">
        <h2 className="text-2xl font-bold">Зображення курсу</h2>
        <p className="mt-2 text-primary-500">
          Завантажте зображення, що відображатиме цей курс.
        </p>
        <div className="relative mt-6 flex h-40 w-full items-center justify-center rounded-md border-2 border-dashed border-primary-300 p-6 text-center hover:border-primary-400">
          <div className="space-y-1 text-sm text-primary-500">
            <UploadIcon className="mx-auto h-6 w-6" />
            <p>Перетягніть зображення сюди або натисніть, щоб завантажити.</p>
            <p className="text-xs">PNG до 10MB</p>
          </div>
          <input
            type="file"
            className="absolute z-10 h-full w-full opacity-0"
            accept=".png"
            id="course-image"
            onChange={onSelectFile}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 md:px-6">
        <div>
          <h2 className="text-2xl font-bold">Архівування курсу</h2>
          <p className="mt-2 text-primary-500">
            Архівуйте цей курс, щоб він більше не був доступний для студентів.
          </p>
        </div>
        <Button
          className="w-fit"
          disabled={course.data?.state == "Archived"}
          onClick={() =>
            archiveCourse.mutate({ data: { course_id: parseInt(courseId) } })
          }
        >
          Архівувати курс
        </Button>
      </div>
      <div className="flex flex-col gap-4 px-4 md:px-6">
        <div>
          <h2 className="text-2xl font-bold">Публікація курсу</h2>
          <p className="mt-2 text-primary-500">
            Опублікуйте цей курс, щоб він став доступним для студентів.
          </p>
        </div>
        <Button
          className="w-fit"
          onClick={() =>
            publishCourse.mutate({ data: { course_id: parseInt(courseId) } })
          }
          disabled={course.data?.state == "Published"}
        >
          Опублікувати курс
        </Button>
      </div>
    </section>
  );
}
