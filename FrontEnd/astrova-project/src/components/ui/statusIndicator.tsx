import { cn } from './utils'

interface StatusIndicatorProps {
    status: 'online' | 'offline' | 'loading'
    className?: string,
    notShowText?: boolean
}

export function StatusIndicator({ status, className, notShowText = false }: StatusIndicatorProps) {
    const statusConfig = {
        online: 'bg-green-500 shadow-green-500/50',
        offline: 'bg-red-500 shadow-red-500/50',
        loading: 'bg-amber-500 animate-pulse',
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <div id="indicator" className={cn('w-2 h-2 rounded-full shadow-lg', statusConfig[status])} />
            {!notShowText && <span className="text-xs text-muted-foreground">
                Backend {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : ''}
            </span>}

        </div>
    )
}
