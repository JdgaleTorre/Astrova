import { Link, useLocation } from '@tanstack/react-router'
import { Menu, Sparkles } from 'lucide-react';
import { NAVIGATION_LINKS } from '../utils/navigationLinks.tsx';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { StatusIndicator } from './ui/statusIndicator';
import { useQuery } from '@tanstack/react-query';
import { checkHealth } from '../services/health';
import { useState } from 'react';

export function Header() {
    const location = useLocation();
    const [sheetOpen, setSheetOpen] = useState(false);

    const { data: healthData, isError } = useQuery({
        queryKey: ['backend-health'],
        queryFn: checkHealth,
        refetchInterval: 5 * 60 * 1000,
        retry: 1,
    });

    const status = healthData ? 'online' : isError ? 'offline' : 'loading';

    return (
        <header className="fixed top-0 z-50 w-full border-b pl-4 border-white/5 backdrop-blur-xl bg-surface/60 shadow-lg shadow-black/20">
            <div className="flex h-16 items-center">
                <Link to='/' className="flex items-center gap-2 mr-8 group">
                    <div className="relative">
                        <Sparkles className="h-6 w-6 text-cyan transition-transform group-hover:rotate-12 group-hover:scale-110" />
                        <div className="absolute inset-0 blur-lg bg-cyan/30 group-hover:bg-cyan/50 transition-colors" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
                        <span className="text-soft-white">Astro</span>
                        <span className="text-primary">va</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {NAVIGATION_LINKS.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-2 text-sm font-medium transition-all rounded-lg relative group ${location.pathname === item.path
                                ? 'text-cyan'
                                : 'text-muted-foreground hover:text-soft-white'
                                }`}

                            id={location.pathname === item.path ? 'active-nav-link' : undefined}
                        >
                            {item.label}
                            {location.pathname === item.path && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan shadow-lg shadow-cyan/50" />
                            )}
                            <span className="absolute inset-0 rounded-lg bg-cyan/0 group-hover:bg-cyan/5 transition-colors" />
                        </Link>
                    ))}
                </nav>

                {/* Mobile Navigation */}
                <div className="flex-1 md:hidden" />
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="hover:bg-cyan/10">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-surface/95 backdrop-blur-xl border-white/10">
                        <nav className="flex flex-col gap-2 mt-10">
                            {NAVIGATION_LINKS.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSheetOpen(false)}
                                    className={`px-4 py-3 text-sm font-medium transition-all rounded-lg ${location.pathname === item.path
                                        ? 'text-cyan bg-cyan/10 border border-cyan/20'
                                        : 'text-muted-foreground hover:text-soft-white hover:bg-white/5'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between px-4 py-2">
                                    <span className="text-sm text-muted-foreground">Backend Status</span>
                                    <StatusIndicator status={status} notShowText />
                                </div>
                            </div>
                        </nav>
                    </SheetContent>
                </Sheet>

                <div className="ml-auto hidden md:flex items-center gap-4 mr-3">
                    <StatusIndicator status={status} />
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-cyan/20 text-cyan hover:bg-cyan/10 hover:border-cyan/40 hover:shadow-lg hover:shadow-cyan/20 transition-all"
                    >
                        <a
                            href="https://api.nasa.gov/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            API Docs
                        </a>
                    </Button>
                </div>

            </div>
        </header >
    );
}