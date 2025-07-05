import { Loader2 } from "lucide-react";

interface LoadingProps {
    size?: number;
    className?: string;
}

export function Loading({ size = 8, className = "" }: LoadingProps) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className={`h-${size} w-${size} animate-spin text-primary ${className}`} />
        </div>
    );
}
