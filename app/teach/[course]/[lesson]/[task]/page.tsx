"use client";

import { DiagramEdit } from "@/components/tasks/DiagramEdit";
import { useParams } from "next/navigation";

export default function EditTaskPage() {
  const { course, lesson, task } = useParams<{
    course: string;
    lesson: string;
    task: string;
  }>();
  return (
    <div className="flex h-[calc(100dvh-4.5rem)] w-full flex-col md:h-dvh">
      <div className="flex justify-between p-4">
        <h1>
          Edit Task with id{" "}
          <span className="font-mono font-semibold">{task}</span> for lesson{" "}
          <span className="font-mono font-semibold">{lesson}</span> at course{" "}
          <span className="font-mono font-semibold">{course}</span>
        </h1>
        <p>Task controls (change task type)</p>
      </div>
      <DiagramEdit />
    </div>
  );
}
