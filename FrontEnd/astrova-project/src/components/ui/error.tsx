import { AlertTriangle } from "lucide-react";
import { cn } from "./utils";

interface ErrorDisplayProps {
    error: unknown;
    className?: string;
}

const errorMessages: Record<string, string> = {
    "400": "The requested date is invalid or out of range",
    "404": "No astronomy picture found for this date",
    "429": "Too many requests. Please try again later",
    "500": "NASA's servers are experiencing issues. Please try again later",
    "502": "NASA's servers are experiencing issues. Please try again later",
    "503": "NASA's servers are temporarily unavailable. Please try again later",
    ECONNABORTED: "Request timed out. Please check your connection and try again",
    ERR_NETWORK: "Unable to connect. Please check your internet connection",
};

function getUserFriendlyMessage(error: unknown): string {
    if (!(error instanceof Error)) {
        return "An unexpected error occurred";
    }

    const axiosError = error as { response?: { status?: number }; code?: string };
    
    if (axiosError.response?.status) {
        const status = String(axiosError.response.status);
        if (errorMessages[status]) {
            return errorMessages[status];
        }
    }

    if (axiosError.code && errorMessages[axiosError.code]) {
        return errorMessages[axiosError.code];
    }

    return error.message || "An unexpected error occurred";
}

export function ErrorDisplay({ error, className }: ErrorDisplayProps) {
    const errorMessage = getUserFriendlyMessage(error);

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 rounded-xl bg-destructive/10 border border-destructive/30",
                className
            )}
        >
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-center text-lg font-medium">
                {errorMessage}
            </p>
        </div>
    );
}
