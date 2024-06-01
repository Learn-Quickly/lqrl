"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeIcon } from "lucide-react";
import { useApiGetAttendants } from "@/dist/kubb";
import { useParams } from "next/navigation";

function Attendee({ username }: { username: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{username}</CardTitle>
        <CardDescription>Enrolled on May 1, 2023</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Progress</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div className="h-full w-[75%] rounded-full bg-green-500" />
              </div>
              <span className="text-base font-medium">75%</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Certification
            </p>
            <div className="flex items-center space-x-2">
              <BadgeIcon className="h-6 w-6 text-green-500" />
              <span className="text-base font-medium">Awarded</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Lessons Completed
            </p>
            <p className="text-base font-medium">12 of 24</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Attendees() {
  const { course: courseId } = useParams<{ course: string }>();
  const attendants = useApiGetAttendants({ course_id: parseInt(courseId) });
  return (
    <section className="w-full border-t py-12">
      <div className="grid gap-12 px-4 md:px-6">
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">Учні</h2>
          <p className="text-gray-500">Перегляд учасників цього курсу.</p>
        </div>
        <div className="grid gap-6">
          {attendants.data?.map((attendee) => (
            <Attendee key={attendee.id} username={attendee.username} />
          ))}
          {attendants.data?.length == 0 && (
            <p className="text-gray-500">
              Наразі на цьому курсі немає учасників.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
