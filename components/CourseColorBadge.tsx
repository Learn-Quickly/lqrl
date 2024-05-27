import { CourseColor } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";

export function CourseColorBadge({
  color,
  active,
  onClick,
}: {
  color: CourseColor;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <Badge
      variant={color}
      onClick={onClick}
      className={clsx(
        "cursor-pointer",
        active &&
          clsx(
            color === "red" && "border-red-500",
            color === "yellow" && "border-yellow-500",
            color === "blue" && "border-blue-500",
            color === "green" && "border-green-500",
          ),
      )}
    >
      {clsx(
        color === "red" && "Червоний",
        color === "yellow" && "Жовтий",
        color === "blue" && "Синій",
        color === "green" && "Зелений",
      )}
    </Badge>
  );
}
