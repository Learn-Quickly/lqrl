"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function Teach() {
  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);

  return (
    <>
      <main className="flex min-h-full grow flex-col items-center justify-between p-24 md:overflow-y-auto">
        Teach
      </main>
      {navLinksPortal
        ? createPortal(
            <>
              <span>Sublink</span>
              <span>Sublink</span>
              <span>Sublink</span>
            </>,
            navLinksPortal,
          )
        : null}
    </>
  );
}
