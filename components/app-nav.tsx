"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Blocks, GraduationCap, UsersRound, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

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
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 md:flex-col md:items-start">
          <Link href="/" className="flex items-center gap-2 p-1 md:p-4">
            <div className="rounded-md bg-primary-300 p-1">
              <Blocks size="32" />
            </div>
            <span className="text-xl font-bold tracking-wider md:text-2xl">
              LQRL
            </span>
          </Link>
          <div className="flex h-fit w-fit gap-2 rounded-md bg-primary-300 p-2">
            <Button asChild variant={teachPath ? "ghost" : "default"}>
              <Link href="/">
                {!teachPath && <GraduationCap className="mr-2 size-4" />}
                Learn
              </Link>
            </Button>
            <Button asChild variant={teachPath ? "default" : "ghost"}>
              <Link href="/teach">
                {teachPath && <UsersRound className="mr-2 size-4" />}
                Teach
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
          className="flex flex-col gap-2 p-2 empty:hidden"
        />
      </div>
      {isLogged ? (
        <div className="hidden items-center gap-0.5 md:flex md:justify-between">
          <Button variant="ghost" size="sm" className="" asChild>
            <Link href="/profile">
              <span className="font-medium">@{username}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size="18" />
          </Button>
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
