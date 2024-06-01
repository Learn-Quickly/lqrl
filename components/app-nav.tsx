"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Blocks, GraduationCap, UsersRound, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { clsx } from "clsx";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export function Navigation() {
  const pathname = usePathname();
  const teachPath = pathname.includes("/teach");
  const { isLogged, username, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex w-full max-w-full flex-col justify-between bg-primary-200 p-2 md:h-dvh md:w-fit md:p-3">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-3 md:flex-col md:items-start">
          <Link href="/" className="flex items-center gap-2 p-1 md:p-4">
            <div className="rounded-md bg-primary-300 p-1">
              <Blocks size="32" />
            </div>
            <span className="text-xl font-bold tracking-wider">LQRL</span>
          </Link>
          <div className="flex h-fit w-fit justify-center gap-2 self-center rounded-md bg-primary-300 p-1.5">
            <Button
              asChild
              size="sm"
              className={!teachPath ? "sm:w-28" : ""}
              variant={teachPath ? "ghost" : "default"}
            >
              <Link href="/">
                <GraduationCap
                  className={clsx("size-4", !teachPath && "sm:mr-2")}
                />
                {!teachPath && <span className="hidden sm:inline">Учень</span>}
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className={teachPath ? "sm:w-28" : ""}
              variant={teachPath ? "default" : "ghost"}
            >
              <Link href="/teach">
                <UsersRound
                  className={clsx("size-4", teachPath && "sm:mr-2")}
                />
                {teachPath && <span className="hidden sm:inline">Вчитель</span>}
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-0.5 self-center overflow-hidden md:hidden">
            <Button variant="ghost" size="sm" asChild>
              <Link href={isLogged ? "/profile" : "/login"}>
                <User />
              </Link>
            </Button>
          </div>
        </div>
        <div
          id="navLinksPortal"
          className="flex p-0.5 empty:hidden md:flex-col md:p-2"
        />
      </div>
      {isLogged ? (
        <div className="hidden items-center gap-0.5 md:flex md:justify-between">
          <Button variant="ghost" size="sm" className="" asChild>
            <Link href="/profile">
              <span className="font-medium">@{username}</span>
            </Link>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size="18" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Вийти з системи</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <div className="hidden items-center gap-0.5 md:flex md:justify-between">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/login">Увійти</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
