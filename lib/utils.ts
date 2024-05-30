import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CourseState } from "@/constants";

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
