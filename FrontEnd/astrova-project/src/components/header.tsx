import { Link, useLocation } from '@tanstack/react-router';
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
    <header className="bg-surface/60 fixed top-0 z-50 w-full border-b border-white/5 pl-4 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="flex h-16 items-center">
        <Link to="/" className="group mr-8 flex items-center gap-2">
          <div className="relative">
            <Sparkles className="text-cyan h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <div className="bg-cyan/30 group-hover:bg-cyan/50 absolute inset-0 blur-lg transition-colors" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
            <span className="text-soft-white">Astro</span>
            <span className="text-primary">va</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {NAVIGATION_LINKS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'text-cyan'
                  : 'text-muted-foreground hover:text-soft-white'
              }`}
              id={
                location.pathname === item.path ? 'active-nav-link' : undefined
              }
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="bg-cyan shadow-cyan/50 absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full shadow-lg" />
              )}
              <span className="bg-cyan/0 group-hover:bg-cyan/5 absolute inset-0 rounded-lg transition-colors" />
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
          <SheetContent
            side="right"
            className="bg-surface/95 border-white/10 backdrop-blur-xl"
          >
            <nav className="mt-10 flex flex-col gap-2">
              {NAVIGATION_LINKS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSheetOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'text-cyan bg-cyan/10 border-cyan/20 border'
                      : 'text-muted-foreground hover:text-soft-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-muted-foreground text-sm">
                    Backend Status
                  </span>
                  <StatusIndicator status={status} notShowText />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="mr-3 ml-auto hidden items-center gap-4 md:flex">
          <StatusIndicator status={status} />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-cyan/20 text-cyan hover:bg-cyan/10 hover:border-cyan/40 hover:shadow-cyan/20 transition-all hover:shadow-lg"
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
    </header>
  );
}
