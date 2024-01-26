import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export function CourseCard({
  title,
  description,
  color,
}: {
  title: string;
  description?: string;
  color: "red" | "blue" | "yellow";
}) {
  return (
    <Card>
      <CardHeader
        className={cn(
          color == "red" && "bg-red-50",
          color == "yellow" && "bg-yellow-50",
          color == "blue" && "bg-blue-50",
        )}
      >
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
      <CardFooter>
        <p>Learn more</p>
      </CardFooter>
    </Card>
  );
}

export function CourseCardNew() {
  return (
    <Card>
      <CardContent className="flex h-full items-center justify-center">
        <Plus />
      </CardContent>
    </Card>
  );
}
