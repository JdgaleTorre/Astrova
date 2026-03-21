import { AlertTriangle, ExternalLink, Orbit, Rocket, Ruler, Timer } from "lucide-react";
import type { NeoAsteroid } from "../services/nasa";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from 'date-fns';

export default function AsteroidCard({ asteroid }: { asteroid: NeoAsteroid }) {
    const approach = asteroid.close_approach_data[0];
    const diameter = asteroid.estimated_diameter.meters;

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/30 transition-colors ">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg text-soft-white">{asteroid.name}</CardTitle>
                    {asteroid.is_potentially_hazardous_asteroid && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                            <AlertTriangle className="h-3 w-3" />
                            Hazardous
                        </span>
                    )}
                </div>
                <a
                    href={asteroid.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan hover:text-cyan/80 flex items-center gap-1 transition-colors"
                >
                    NASA JPL <ExternalLink className="h-3 w-3" />
                </a>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span>Size</span>
                    </div>
                    <span className="text-soft-white text-right">
                        {diameter.estimated_diameter_min.toFixed(0)} - {diameter.estimated_diameter_max.toFixed(0)} m
                    </span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Rocket className="h-4 w-4 text-stellar-orange" />
                        <span>Velocity</span>
                    </div>
                    <span className="text-soft-white text-right">
                        {parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h
                    </span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Orbit className="h-4 w-4 text-secondary" />
                        <span>Miss Distance</span>
                    </div>
                    <span className="text-soft-white text-right">
                        {parseFloat(approach.miss_distance.lunar).toFixed(2)} lunar
                    </span>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Timer className="h-4 w-4 text-cyan" />
                        <span>Approach</span>
                    </div>
                    <span className="text-soft-white text-right">
                        {format(new Date(approach.close_approach_date), 'MMM d, yyyy')}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}