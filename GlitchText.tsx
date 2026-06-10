import { ReactNode } from "react";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
}

export function GlitchText({ text, as: Component = "h1", className = "" }: GlitchTextProps) {
  return (
    <Component
      className={`glitch-text-wrapper ${className}`}
      data-text={text}
    >
      {text}
    </Component>
  );
}
