import React from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

export function Button({
                           variant = "primary",
                           children,
                           className = "",
                           ...props
                       }: ButtonProps) {
    const base =
        "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants: Record<ButtonVariant, string> = {
        secondary:
            "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 focus-visible:ring-gray-400",
        primary:
            "bg-base-purple text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}