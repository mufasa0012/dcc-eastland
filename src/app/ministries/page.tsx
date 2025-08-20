
'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getMinistries, Ministry } from '@/services/ministryService';
import { getMinistriesPageContent, MinistriesPageContent } from '@/services/ministriesPageService';
import { Baby, HandHeart, Users, HeartHandshake, Utensils, Drama, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const iconMap: { [key: string]: LucideIcon } = {
  "Children's Ministry": Baby,
  "Community Outreach": HandHeart,
  "Men's Ministry": Users,
  "Women of Grace": HeartHandshake,
};

const ministryDetails: { [key: string]: {
    subtitle: string;
    description: string;
    expect: string[];
} } = {
    "Children's Ministry": {
        subtitle: "A Safe and Fun Place to Learn and Grow",
        description: "Our Children's Ministry is dedicated to creating a vibrant and engaging environment where kids can discover the love of God. We believe in nurturing faith from a young age through age-appropriate lessons, creative activities, music, and fun. We are committed to providing a safe and supportive space where every child feels known, valued, and excited to learn about Jesus.",
        expect: [
            "Interactive lessons and crafts during our main service.",
            "Fun activities like VBS (Vacation Bible School), holiday parties, and family movie nights.",
            "A team of background-checked volunteers who are passionate about ministering to children."
        ]
    },
    "Community Outreach": {
        subtitle: "Serving Our Neighbors with Love and Compassion",
        description: "Our Community Outreach ministry is the heart of our mission to serve the world beyond our church walls. We believe that faith is not meant to be contained within a building, but is a powerful force for good in our neighborhoods and city. This ministry provides a way for anyone to put their faith into action, making a tangible difference in the lives of those around us. We partner with local organizations and mobilize volunteers to meet needs, spread hope, and demonstrate the love of Christ in practical ways.",
        expect: [
            "Regular service projects like organizing food drives, volunteering at local shelters, or helping with community clean-up efforts.",
            "Collaboration with other non-profits and community groups to amplify our impact and address specific local needs.",
            "Building community and relationships with fellow members as we work side-by-side to serve our neighbors."
        ]
    },
    "Men's Ministry": {
        subtitle: "Building a Foundation of Faith, Character, and Brotherhood",
        description: "The Forge is a ministry designed to empower young men to become courageous leaders, men of integrity, and followers of Christ. We tackle the real-life challenges and questions facing young men today, from career and relationships to personal struggles and spiritual growth. Our goal is to forge a community where men can be authentic, grow in their faith, and build lifelong friendships.",
        expect: [
            "Weekly Bible Studies focused on applying biblical principles to modern life.",
            "Fellowship events like sports, outdoor adventures, and service projects.",
            "Opportunities to connect with older men in the church for guidance and support."
        ]
    },
    "Women of Grace": {
        subtitle: "A Community for Connection, Encouragement, and Spiritual Growth",
        description: "The Women of Grace ministry provides a welcoming and supportive space for women of all ages and stages of life. We believe in the power of community to uplift and inspire. Through shared experiences, honest conversation, and a focus on God's Word, we seek to deepen our relationship with Christ and with each other. Come and find a place to belong, be encouraged, and grow in God's grace.",
        expect: [
            "Regular opportunities to study scripture together.",
            "Annual retreats for rest, renewal, and focused worship.",
            "Social gatherings like coffee meetups, craft nights, and fellowship events."
        ]
    }
};

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [pageContent, setPageContent] = useState<MinistriesPageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMinistries = async () => {
      setIsLoading(true);
      const ministryList = await getMinistries();
      const content = await getMinistriesPageContent();
      setMinistries(ministryList);
      setPageContent(content);
      setIsLoading(false);
    };
    fetchMinistries();
  }, []);

  return (
    <>
      <section className="relative h-60 flex items-center justify-center text-center text-white">
        <Image
          src={pageContent?.imageUrl || "https://placehold.co/1600x400.png"}
          alt="Community members serving together"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute z-0"
          data-ai-hint="community service"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 container px-4">
          <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
            {pageContent?.title || 'Our Ministries'}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md mt-2">
            {pageContent?.subtitle || 'Find your place to serve and grow within our church family.'}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-secondary/20">
        <div className="container px-4">
          {isLoading
            ? <div className="max-w-4xl mx-auto"><Skeleton className="w-full aspect-video rounded-lg" /></div>
            : (
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 8000,
                            stopOnInteraction: true,
                        }),
                    ]}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                    {ministries.map((ministry) => {
                        const Icon = iconMap[ministry.name] || Users;
                        const details = ministryDetails[ministry.name];
                        const imageUrl = ministry.imageUrl || "https://placehold.co/800x600.png";

                        return (
                        <CarouselItem key={ministry.id}>
                            <div className="p-1">
                                <Card className="overflow-hidden shadow-xl border-t-4 border-primary">
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        <div className="relative aspect-[4/3]">
                                            <Image
                                                src={imageUrl}
                                                alt={ministry.name}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                data-ai-hint="church ministry"
                                            />
                                        </div>
                                        <div className="p-6 md:p-8 flex flex-col">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <CardTitle className="text-2xl font-bold">{ministry.name}</CardTitle>
                                            </div>
                                            <p className="text-md text-primary font-semibold mb-4">{details?.subtitle}</p>
                                            <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">{details?.description || ministry.description}</p>
                                            
                                            {details?.expect && (
                                                <div>
                                                    <h3 className="font-bold text-lg mb-2">What to Expect:</h3>
                                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                                                        {details.expect.map((item, i) => <li key={i}>{item}</li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                        )
                    })}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
              )
          }
        </div>
      </section>
    </>
  );
}
