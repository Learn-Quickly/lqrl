"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBackpack,
  IconSchool,
  IconUsers,
  IconLogout,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();
  const teachPath = pathname.includes("/teach");

  return (
    <nav className="bg-primary-200 flex h-dvh flex-col justify-between p-3">
      <div className="flex flex-col gap-3">
        <Link href="/" className="flex items-center gap-2 p-4">
          <div className="bg-primary-300 rounded-md p-1">
            <IconBackpack size="32" />
          </div>
          <span className="text-2xl font-bold tracking-wider">LQRL</span>
        </Link>
        <div className="bg-primary-300 flex justify-between gap-2 rounded-md p-2">
          <Button asChild variant={teachPath ? "ghost" : "default"}>
            <Link href="/">
              {!teachPath && <IconSchool className="mr-2 size-4" />}
              Learn
            </Link>
          </Button>
          <Button asChild variant={teachPath ? "default" : "ghost"}>
            <Link href="/teach">
              {teachPath && <IconUsers className="mr-2 size-4" />}
              Teach
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-between gap-0.5">
        <Button variant="ghost" size="sm">
          <span className="font-medium">@username</span>
        </Button>
        <Button variant="ghost" size="sm">
          <IconLogout size="18" />
        </Button>
      </div>
    </nav>
  );
}
