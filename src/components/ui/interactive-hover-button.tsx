import React from "react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <span className="relative z-20 inline-block transition-all duration-300 group-hover:opacity-0">
        {text}
      </span>
      <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span>{text}</span>
      </div>
      <div className="absolute left-0 top-0 h-0 w-0 rounded-lg bg-primary/20 transition-all duration-300 group-hover:h-full group-hover:w-full"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
