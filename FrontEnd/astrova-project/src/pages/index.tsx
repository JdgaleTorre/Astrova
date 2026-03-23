// src/routes/apod.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Starfield } from '../components/starfield';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';
import { FEATURED_LINKS } from '../utils/navigationLinks';
import { TECH_STACK } from '../utils/techStack.tsx';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <Starfield />
        {/* Subtle grain texture overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-[0.015]" />

        <div className="relative z-10 container px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="bg-cyan/10 border-cyan/20 text-cyan mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Powered by NASA's Open APIs</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
              <span className="text-soft-white">Explore the </span>
              <span className="relative inline-block">
                <span className="text-cyan relative z-10">cosmos</span>
                <span className="bg-cyan/30 absolute inset-0 blur-2xl" />
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto max-w-2xl text-xl md:text-2xl">
              One data point at a time
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-cyan hover:bg-cyan/90 text-background shadow-cyan/30 hover:shadow-cyan/50 px-8 shadow-lg transition-all"
              >
                <Link to="/apod">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="hover:border-cyan/20 border-white/10 px-8 hover:bg-white/5"
              >
                <a
                  href="https://api.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="border-cyan/30 flex h-10 w-6 items-start justify-center rounded-full border-2 p-2">
            <div className="bg-cyan/50 h-3 w-1 rounded-full" />
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-soft-white">Discover </span>
              <span className="text-cyan">Space Data</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Access real-time data from NASA's missions and observatories
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {FEATURED_LINKS.map((link) => (
              <Link key={link.path} to={link.path} className="group">
                <Card
                  className={`bg-card/50 h-full border-white/5 backdrop-blur-sm hover:border-${link.color}/20 hover:shadow-xl hover:shadow-${link.color}/10 transition-all duration-300 hover:-translate-y-1`}
                >
                  <CardHeader>
                    <div
                      className={`h-12 w-12 rounded-lg bg-${link.color}/10 mb-4 flex items-center justify-center group-hover:bg-${link.color}/20 transition-colors`}
                    >
                      {link.icon}
                    </div>
                    <CardTitle
                      className={`text-soft-white group-hover:text-${link.color} transition-colors`}
                    >
                      {link.label}
                    </CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`flex items-center text-sm text-${link.color} transition-all group-hover:gap-2`}
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-soft-white">About </span>
              <span className="text-cyan">This Project</span>
            </h2>
          </div>

          <Card className="bg-card/50 mx-auto max-w-5xl border-white/5 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <Sparkles className="text-cyan h-8 w-8" />
                    <div>
                      <h3 className="text-soft-white text-2xl font-bold">
                        Astrova
                      </h3>
                      <p className="text-cyan text-sm">NASA Space Explorer</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    An interactive full-stack web application that brings NASA's
                    universe of space data to life through stunning
                    visualizations, real-time data, and a sleek space-themed
                    interface.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The backend acts as a secure proxy between the frontend and
                    NASA's APIs, keeping your API key safe and handling data
                    transformation before it reaches you.
                  </p>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="text-soft-white text-lg font-semibold">
                      Key Features
                    </h4>
                    <div className="space-y-3">
                      {FEATURED_LINKS.map((link) => (
                        <div
                          key={link.path}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`h-8 w-8 rounded-lg bg-${link.color}/10 flex items-center justify-center`}
                          >
                            {link.icon}
                          </div>
                          <div>
                            <span className="text-soft-white font-medium">
                              {link.label}
                            </span>
                            <p className="text-muted-foreground text-xs">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <Button
                      asChild
                      className="bg-cyan hover:bg-cyan/90 text-background w-full"
                    >
                      <Link to="/apod">
                        Start Exploring
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-surface/30 py-24">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setIsTechStackOpen(!isTechStackOpen)}
            className="group mb-8 w-full text-center"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              <span className="text-soft-white">Our </span>
              <span className="text-cyan">Tech Stack</span>
            </h2>
            <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-lg">
              The tools and technologies powering this application
            </p>
            <ChevronDown
              className={`text-muted-foreground mx-auto h-6 w-6 transition-transform duration-300 ${isTechStackOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`grid gap-8 transition-all duration-300 ease-in-out md:grid-cols-2 lg:grid-cols-3 ${
              isTechStackOpen
                ? 'max-h-500 opacity-100'
                : 'max-h-0 overflow-hidden opacity-0'
            }`}
          >
            {TECH_STACK.map((section) => (
              <Card
                key={section.category}
                className="bg-card/50 border-white/5 backdrop-blur-sm"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-cyan/10 flex h-12 w-12 items-center justify-center rounded-lg">
                    {section.icon}
                  </div>
                  <CardTitle className="text-soft-white">
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item) => {
                      const IconComponent = item.Icon;
                      return (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                        >
                          <div className="text-cyan flex h-8 w-8 shrink-0 items-center justify-center transition-transform group-hover:scale-110">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-soft-white group-hover:text-cyan block transition-colors">
                              {item.name}
                            </span>
                            <p className="text-muted-foreground truncate text-xs">
                              {item.description}
                            </p>
                          </div>
                          <ExternalLink className="text-muted-foreground group-hover:text-cyan h-4 w-4 shrink-0 transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
