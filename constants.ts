export const loginReasons = {
  usernameUpdated: "usernameUpdated",
  passwordUpdated: "passwordUpdated",
  logout: "logout",
};
export const authStoreKey = "auth-storage";

export type CourseColor = "red" | "blue" | "yellow" | "green";
export type CourseState = "Draft" | "Published" | "Archived";
export type ExerciseDifficulty = "Read" | "Easy" | "Medium" | "Hard";
export type LessonProgressServerState = "InProgress" | "Done";
export type ExerciseCompletionServerState =
  | "InProgress"
  | "Succeeded"
  | "Failed";
export type ExerciseType = "Conspect" | "InteractiveConspect";

export const paginationLimit = 6;
