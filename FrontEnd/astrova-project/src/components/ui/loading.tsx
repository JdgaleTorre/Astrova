import { cn } from "./utils";

interface LoadingProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const sizes = {
    sm: "size-8",
    md: "size-12",
    lg: "size-16",
};

export function Loading({ className, size = "md" }: LoadingProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div
                className={cn(
                    "animate-spin rounded-full border-4 border-primary border-t-transparent",
                    sizes[size],
                    className
                )}
            />
        </div>
    );
}
