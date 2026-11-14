import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface InteractiveHoverButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "gradient" | "glass";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  id?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  id,
  type = "button",
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5",
  };

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 border border-blue-500/40",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-950/20 border border-slate-700/60",
    outline:
      "bg-white/80 hover:bg-white text-slate-800 hover:text-blue-600 border border-slate-200 hover:border-blue-400 shadow-2xs",
    gradient:
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30",
    glass:
      "bg-white/70 hover:bg-white/90 backdrop-blur-md text-slate-900 border border-white/60 shadow-xs",
  };

  return (
    <motion.button
      ref={buttonRef}
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        // @ts-ignore
        "--cursor-x": `${cursorPos.x}px`,
        "--cursor-y": `${cursorPos.y}px`,
      }}
      className={`relative inline-flex items-center justify-center overflow-hidden cursor-pointer select-none transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {/* Specular Radial Spotlight following cursor on hover */}
      {isHovered && (
        <span
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(110px circle at var(--cursor-x) var(--cursor-y), rgba(255, 255, 255, 0.32), transparent 75%)`,
          }}
        />
      )}

      {/* Radiant Glow Pulse Ring on Hover */}
      {isHovered && (
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-40 ring-2 ring-white/60"
        />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
        <span>{children}</span>
      </span>
    </motion.button>
  );
};
