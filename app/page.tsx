"use client";

import { useEffect, useState } from "react";
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
import { CourseCard, CourseCardNew } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { createPortal } from "react-dom";
import Link from "next/link";

export default function Home() {
  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);
  return (
    <main className="flex min-h-full max-w-7xl grow flex-col gap-8 p-12 md:overflow-y-auto md:p-24">
      {navLinksPortal
        ? createPortal(
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-fit self-end"
                asChild
              >
                <Link href="/explore">Пошук курсів</Link>
              </Button>
            </>,
            navLinksPortal,
          )
        : null}
      <div className="flex items-center justify-between gap-2">
        <H1>Мої курси</H1>
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
                    <DollarSignIcon className="mr-2 size-4" /> Будь-яка ціна
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ціна</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Будь-яка ціна
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Безкоштовні
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Платні</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-fit">
                    <PaletteIcon className="mr-2 size-4" /> Будь-який колір
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Ціна</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Будь-який колір
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Безкоштовні
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Платні</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative w-full">
                <SearchIcon className="text-muted-foreground absolute left-2.5 top-3 size-4" />
                <Input
                  type="search"
                  placeholder="Search..."
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
        <CourseCard
          title="Мнемотехніки Ведмедика Медика"
          description="Розвиток когнітивних навичок для дітей"
          state="Published"
          color="red"
          length="2h 30m"
          progress="4/54 lessons"
        />
        <CourseCard
          title="Професійний розвиток вчителів"
          description="Вчимося навчати"
          state="Published"
          color="yellow"
          length="8h 15m"
          progress="3/18 lessons"
        />
        <CourseCard
          title="AdVanced React"
          description="Learn how to connect useState with Pocketbase"
          state="Published"
          color="blue"
          length="3h"
          progress="1/4 lessons"
        />
        <CourseCardNew />
      </div>
      <Pagination makeLink={() => ""} currentPage={1} totalPages={1} />
    </main>
  );
}
