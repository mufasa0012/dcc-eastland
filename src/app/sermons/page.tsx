
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getSermons, Sermon } from '@/services/sermonService';
import { Headphones, Video, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      setIsLoading(true);
      const sermonList = await getSermons();
      setSermons(sermonList);
      setIsLoading(false);
    };
    fetchSermons();
  }, []);

  return (
    <>
      <section className="relative h-60 flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1600x400.png"
          alt="Church pews"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute z-0"
          data-ai-hint="church pews"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 container px-4">
          <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
            Sermon Archive
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md mt-2">
            Explore our collection of past messages.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                            <Skeleton className="h-6 w-72 mb-2" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : sermons.map((sermon) => (
                  <Card key={sermon.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="sm:col-span-2">
                          <h2 className="text-2xl font-bold mb-1">{sermon.title}</h2>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm mb-4">
                             <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                <span>{sermon.speaker}</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(sermon.date).toLocaleDateString()}</span>
                             </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col justify-start sm:justify-center sm:items-end gap-2">
                          {sermon.audioUrl && (
                            <Button asChild variant="outline" className="w-full sm:w-auto">
                              <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">
                                <Headphones className="mr-2 h-4 w-4" />
                                Listen
                              </a>
                            </Button>
                          )}
                           {sermon.videoUrl && (
                            <Button asChild variant="outline" className="w-full sm:w-auto">
                              <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-4 w-4" />
                                Watch
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            {sermons.length === 0 && !isLoading && (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold mb-2">No Sermons Yet</h2>
                    <p className="text-muted-foreground">Check back later for new messages.</p>
                </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
