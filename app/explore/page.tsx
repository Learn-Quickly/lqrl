"use client";

import { useState } from "react";
import { H1 } from "@/components/ui/typography";
import { Pagination } from "@/components/Pagination";
import {
  DollarSignIcon,
  FilterIcon,
  PaletteIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CourseCard, CourseCardNotFound } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useApiGetCoursesHandler } from "@/dist/kubb";
import { CourseColor, paginationLimit } from "@/constants";
import { clsx } from "clsx";
import { useSearchParams } from "next/navigation";

type ColorFilter = CourseColor | "any";
type PriceFilter = "any" | "free" | "paid";
function makeFilterString({
  color,
  price,
  name,
}: {
  color: ColorFilter;
  price: PriceFilter;
  name: string;
}) {
  const colorFilter = color == "any" ? {} : { color: { $eq: color } };
  const priceFilter =
    price == "any"
      ? {}
      : price == "free"
        ? { price: { $eq: 0 } }
        : { price: { $gt: 0 } };
  const nameFilter = name ? { title: { $contains: name } } : {};
  const stateFilter = { state: { $eq: "Published" } };

  const filters = [
    { ...colorFilter, ...priceFilter, ...nameFilter, ...stateFilter },
  ];

  return JSON.stringify(filters);
}

export default function SearchCourses() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [colorFilter, setColorFilter] = useState<ColorFilter>("any");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("any");
  const [nameFilter, setNameFilter] = useState("");

  const courses = useApiGetCoursesHandler({
    filters: makeFilterString({
      color: colorFilter,
      price: priceFilter,
      name: nameFilter,
    }),
    list_options: `{"limit": ${paginationLimit}, "offset": ${(page - 1) * paginationLimit}}`,
  });
  return (
    <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
      <div className="flex items-center justify-between gap-2">
        <H1>Пошук курсів</H1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <FilterIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-fit">
                    <DollarSignIcon className="mr-2 size-4" />{" "}
                    {clsx(
                      priceFilter == "any" && "Будь-яка ціна",
                      priceFilter == "free" && "Безкоштовні",
                      priceFilter == "paid" && "Платні",
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ціна</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={priceFilter == "any"}
                    onClick={() => setPriceFilter("any")}
                  >
                    Будь-яка ціна
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priceFilter == "free"}
                    onClick={() => setPriceFilter("free")}
                  >
                    Безкоштовні
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={priceFilter == "paid"}
                    onClick={() => setPriceFilter("paid")}
                  >
                    Платні
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-fit">
                    <PaletteIcon className="mr-2 size-4" />{" "}
                    {clsx(
                      colorFilter == "any" && "Будь-який колір",
                      colorFilter == "green" && "Зелені",
                      colorFilter == "blue" && "Сині",
                      colorFilter == "red" && "Червоні",
                      colorFilter == "yellow" && "Жовті",
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Колір</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={colorFilter == "any"}
                    onClick={() => setColorFilter("any")}
                  >
                    Будь-який колір
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={colorFilter == "green"}
                    onClick={() => setColorFilter("green")}
                  >
                    Зелені
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={colorFilter == "blue"}
                    onClick={() => setColorFilter("blue")}
                  >
                    Сині
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={colorFilter == "red"}
                    onClick={() => setColorFilter("red")}
                  >
                    Червоні
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={colorFilter == "yellow"}
                    onClick={() => setColorFilter("yellow")}
                  >
                    Жовті
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative w-full">
                <SearchIcon className="text-muted-foreground absolute left-2.5 top-3 size-4" />
                <Input
                  type="search"
                  placeholder="Назва"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="bg-background rounded-lg pl-8"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-1 lg:mb-0 lg:grid-cols-2 lg:text-left xl:grid-cols-3"
        style={{ gridAutoRows: "1fr" }}
      >
        {courses.data?.courses.map((course) => (
          <CourseCard
            key={course.id}
            title={course.title}
            description={course.description}
            color={course.color as CourseColor}
            price={course.price}
            intent="explore"
            href={`/explore/${course.id}`}
          />
        ))}
        {courses.data?.courses.length == 0 && <CourseCardNotFound />}
      </div>
      {courses.data && courses.data.count > paginationLimit && (
        <Pagination
          makeLink={(_page) => `/explore?page=${_page}`}
          currentPage={page}
          totalPages={Math.ceil(courses.data?.count / paginationLimit)}
        />
      )}
    </main>
  );
}
