"use client";

interface ButtonProps {
  text: string;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "reset" | "button"
}

const defaultStyles = "text-lg text-white  px-4 py-2 rounded-md hover:inset-0 hover:bg-gradient-to-br hover:from-blue-500/10 hover:via-purple-500/5 hover:to-transparent hover:transition-all duration-200"
export const Button = ({ text, className, disabled, type}: ButtonProps) => {
  return <button
  type={type}
   className={`${defaultStyles} ${className}`}
   disabled={disabled}
  >{text}</button>;
};
