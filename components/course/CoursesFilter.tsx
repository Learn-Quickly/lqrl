import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  DollarSignIcon,
  FilterIcon,
  PaletteIcon,
  SearchIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clsx } from "clsx";
import { Input } from "@/components/ui/input";
import { CourseColor, CourseState } from "@/constants";

type ColorFilter = CourseColor | "any";
type PriceFilter = "any" | "free" | "paid";
function makeFilterString({
  color,
  price,
  name,
  stateEq,
}: {
  color: ColorFilter;
  price: PriceFilter;
  name: string;
  stateEq?: string;
}) {
  const colorFilter = color == "any" ? {} : { color: { $eq: color } };
  const priceFilter =
    price == "any"
      ? {}
      : price == "free"
        ? { price: { $eq: 0 } }
        : { price: { $gt: 0 } };
  const nameFilter = name ? { title: { $contains: name } } : {};
  const stateFilter = stateEq ? { state: { $eq: "Published" } } : {};

  const filters = [
    { ...colorFilter, ...priceFilter, ...nameFilter, ...stateFilter },
  ];

  return JSON.stringify(filters);
}

export function CoursesFilter({
  setFilter,
  stateEq,
}: {
  setFilter: (filter: string) => void;
  stateEq?: CourseState;
}) {
  const [colorFilter, setColorFilter] = useState<ColorFilter>("any");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("any");
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    setFilter(
      makeFilterString({
        color: colorFilter,
        price: priceFilter,
        name: nameFilter,
        stateEq,
      }),
    );
  }, [setFilter, colorFilter, priceFilter, nameFilter, stateEq]);

  return (
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
  );
}
