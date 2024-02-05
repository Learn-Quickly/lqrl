import { H1 } from "@/components/ui/typography";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CourseCard, CourseCardNew } from "@/components/CourseCard";

export default function Home() {
  return (
    <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <H1>My courses</H1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit">
              <Filter className="mr-2 size-4" /> Complete
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem>All</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>
              Complete
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Non-complete</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-1 lg:mb-0 lg:grid-cols-2 lg:text-left xl:grid-cols-3"
        style={{ gridAutoRows: "1fr" }}
      >
        <CourseCard
          title="Мнемотехніки Ведмедика Медика"
          description="Розвиток когнітивних навичок для дітей"
          color="red"
          length="2h 30m"
          progress="4/54 lessons"
        />
        <CourseCard
          title="Професійний розвиток вчителів"
          description="Вчимося навчати"
          color="yellow"
          length="8h 15m"
          progress="3/18 lessons"
        />
        <CourseCard
          title="AdVanced React"
          description="Learn how to connect useState with Pocketbase"
          color="blue"
          length="3h"
          progress="1/4 lessons"
        />
        <CourseCardNew />
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
