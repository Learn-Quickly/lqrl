"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-primary-950 group-[.toaster]:border-primary-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-primary-500",
          actionButton:
            "group-[.toast]:bg-primary-900 group-[.toast]:text-primary-50",
          cancelButton:
            "group-[.toast]:bg-primary-100 group-[.toast]:text-primary-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
