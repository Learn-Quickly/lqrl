import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, Users, MoveRight, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="flex items-center gap-2">
          <Users size="16" />
          <span className="text-sm">216</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDollarSign size="16" />
          <span className="text-sm">free</span>
        </div>
      </CardContent>
      <CardFooter className="flex w-full justify-end">
        <Button variant="outline" className="items-center">
          Learn <MoveRight size="16" className="ml-2" />
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
