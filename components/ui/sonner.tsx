"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ className, style, ...props }: ToasterProps) {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group", className)}
      style={{
        ["--normal-bg" as string]: "var(--popover)",
        ["--normal-text" as string]: "var(--popover-foreground)",
        ["--normal-border" as string]: "var(--border)",
        ...style,
      }}
      {...props}
    />
  );
}

export default Toaster;
