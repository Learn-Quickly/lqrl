import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CourseState, ExerciseDifficulty } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const translateCourseState = (state: CourseState) => {
  switch (state) {
    case "Draft":
      return "Чернетка";
    case "Published":
      return "Опубліковано";
    case "Archived":
      return "Архівовано";
  }
};

export const translateExerciseDifficulty = (difficulty: ExerciseDifficulty) => {
  switch (difficulty) {
    case "Read":
      return "Прочитати";
    case "Easy":
      return "Легко";
    case "Medium":
      return "Середньо";
    case "Hard":
      return "Важко";
  }
};

export const secondsToTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const timestampToDateString = (timestamp: number) => {
  // Convert the timestamp to milliseconds (JavaScript timestamps are in milliseconds)
  const date = new Date(timestamp * 1000);

  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

export function getCompletedPercentage({
  completedLessons,
  totalLessons,
}: {
  completedLessons: number;
  totalLessons: number;
}) {
  if (totalLessons == 0) {
    return 0;
  }
  const percentage = (completedLessons / totalLessons) * 100;
  return Math.round(percentage);
}
