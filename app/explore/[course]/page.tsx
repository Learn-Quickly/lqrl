"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiGetLessonsHandler } from "@/dist/kubb";
import { useParams } from "next/navigation";

export default function Lessons() {
  const { course: courseId } = useParams<{ course: string }>();
  const lessons = useApiGetLessonsHandler(parseInt(courseId));
  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Уроки</h2>
            <p className="text-gray-500">
              Перегляд та управління уроками цього курсу.
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          {/*{lessons.data?.map((lesson) => (*/}
          {/*  <Card key={lesson.id}></Card>*/}
          {/*)}*/}
          <Card>
            <CardHeader>
              <CardTitle>Introduction to Web Development</CardTitle>
              <CardDescription>
                Learn the fundamentals of web development, including HTML, CSS,
                and JavaScript.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-base font-medium">2 hours</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Difficulty
                  </p>
                  <p className="text-base font-medium">Beginner</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-base font-medium">1,234</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-gray-300" />
                    <span className="text-base font-medium">4.5</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Start Lesson</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Advanced CSS Techniques</CardTitle>
              <CardDescription>
                Dive deep into CSS and learn advanced techniques for building
                complex layouts and designs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-base font-medium">3 hours</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    Difficulty
                  </p>
                  <p className="text-base font-medium">Intermediate</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-base font-medium">789</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Rating</p>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <StarIcon className="h-5 w-5 text-gray-300" />
                    <span className="text-base font-medium">4.2</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Start Lesson</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
