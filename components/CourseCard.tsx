import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Plus,
  Users,
  MoveRight,
  CircleDollarSign,
  Calendar,
  CircleDashed,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CourseCard({
  title,
  description,
  color,
  users,
  price,
  length,
  progress,
  intent = "learn",
}: {
  title: string;
  description?: string;
  color: "red" | "blue" | "yellow";
  users?: number;
  price?: number;
  length?: string;
  progress?: string;
  intent?: "learn" | "teach";
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        className={cn(
          color == "red" && "bg-red-50",
          color == "yellow" && "bg-yellow-50",
          color == "blue" && "bg-blue-50",
          "flex flex-1 flex-col justify-end",
        )}
      >
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-4">
        {users && (
          <div className="flex items-center gap-2">
            <Users size="16" />
            <span className="text-sm">{users}</span>
          </div>
        )}
        {price != undefined && (
          <div className="flex items-center gap-2">
            <CircleDollarSign size="16" />
            <span className="text-sm">{price || "free"}</span>
          </div>
        )}
        {length && (
          <div className="flex items-center gap-2">
            <Calendar size="16" />
            <span className="text-sm">{length}</span>
          </div>
        )}
        {progress && (
          <div className="flex items-center gap-2">
            <CircleDashed size="16" />
            <span className="text-sm">{progress}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <Button variant="outline" className="items-center">
          {intent == "learn" && "Learn"} {intent == "teach" && "Edit"}{" "}
          <MoveRight size="16" className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function CourseCardNew() {
  return (
    <Card>
      <CardContent className="flex h-full items-center justify-center p-6">
        <Plus />
      </CardContent>
    </Card>
  );
}
