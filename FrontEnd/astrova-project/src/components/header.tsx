import { Link, useLocation } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react';
import { NAVIGATION_LINKS } from '../utils/navigationLinks';

export function Header() {
    const location = useLocation();

    return (
        <header className="fixed top-0 z-50 w-full border-b pl-4 border-white/5 backdrop-blur-xl bg-surface/60 shadow-lg shadow-black/20">
            <div className="container flex h-16 items-center">
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
                        >
                            {item.label}
                            {location.pathname === item.path && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan shadow-lg shadow-cyan/50" />
                            )}
                            <span className="absolute inset-0 rounded-lg bg-cyan/0 group-hover:bg-cyan/5 transition-colors" />
                        </Link>
                    ))}
                </nav>

            </div>
        </header>
    );
}