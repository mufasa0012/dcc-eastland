

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Cross, Church, Users, HeartHandshake, Headphones, BookOpen, ArrowRight, Calendar, HandHeart, Wind, Utensils, Video, Fingerprint, Eye, Baby } from 'lucide-react';
import type { Sermon } from '@/services/sermonService';
import { getSermons } from '@/services/sermonService';
import type { Ministry } from '@/services/ministryService';
import { getMinistries } from '@/services/ministryService';
import type { Event } from '@/services/eventService';
import { getEvents } from '@/services/eventService';
import { getAboutContent, AboutContent } from '@/services/aboutService';
import { getLeadership, LeadershipMember } from '@/services/leadershipService';
import { getHeroContent } from '@/services/heroService';


export default async function Home() {
  const [sermonList, ministryList, eventList, aboutData, leadershipList, heroData] = await Promise.all([
      getSermons(),
      getMinistries(),
      getEvents(),
      getAboutContent(),
      getLeadership(),
      getHeroContent(),
  ]);

  const sermons = sermonList.slice(0, 4);
  const ministries = ministryList.slice(0, 4);
  const events = eventList.slice(0, 3);
  const aboutContent = aboutData;
  const leadership = leadershipList;
  const heroContent = heroData;

  const iconMap: { [key: string]: React.ElementType } = {
    "Children's Ministry": Baby,
    "Community Outreach": HandHeart,
    "Men's Ministry": Users,
    "Women of Grace": HeartHandshake,
    "default": Wind,
  };

  const eventIconMap: { [key: string]: React.ElementType } = {
    "Men's Breakfast Fellowship": Users,
    "Vacation Bible School Sign-ups": HeartHandshake,
    "Senior's Potluck Luncheon": Utensils,
    "All-Church Picnic": HandHeart,
    "Youth Group Movie Night": BookOpen,
    "Worship & Prayer Night": Cross,
    "default": Calendar,
  }


  const beliefs = aboutContent ? [
      {
          title: "Our Identity",
          description: aboutContent.identity,
          icon: Fingerprint,
      },
      {
          title: "Our Mission",
          description: aboutContent.mission,
          icon: Church,
      },
      {
          title: "Our Vision",
          description: aboutContent.vision,
          icon: Eye,
      },
  ] : [];


  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white">
        <Image
          src={heroContent.imageUrl}
          alt="Interior of the Disciple of Christ Church"
          fill
          style={{objectFit: 'cover'}}
          className="absolute z-0"
          data-ai-hint="church interior"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 container px-4 fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black drop-shadow-lg mb-4">
            {heroContent.headline}
          </h1>
          <p className="text-lg md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md mb-8">
            {heroContent.subheadline}
          </p>
          <div className="space-y-2 text-lg md:text-xl font-semibold">
              <p>{heroContent.serviceTimes}</p>
              <p>{heroContent.address}</p>
          </div>
          <Button size="lg" className="mt-8 font-bold" asChild>
              <Link href="#contact">{heroContent.buttonText}</Link>
          </Button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24 bg-secondary/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">About Our Church</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Learn more about our community, our faith, and our leaders.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {beliefs.map((item, index) => (
              <Card key={index} className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow border-t-4 border-primary">
                  <CardHeader>
                      <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                          <item.icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="mt-4 text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-16" />

          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">Meet Our Leadership</h3>
            <p className="text-muted-foreground mt-2">Guiding our church with wisdom and grace.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary/50">
                  <AvatarImage src={leader.imageUrl} alt={leader.name}/>
                  <AvatarFallback>{leader.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h4 className="font-bold text-xl">{leader.name}</h4>
                <p className="text-primary font-semibold">{leader.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sermon Archive Section */}
      <section id="sermons" className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Past Sermons</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Listen to recent messages from our pastors and guest speakers.
            </p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {sermons.map((sermon, index) => (
              <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-2">
                         {sermon.audioUrl && <Headphones className="h-8 w-8 text-primary/80 shrink-0"/>}
                         {sermon.videoUrl && !sermon.audioUrl && <Video className="h-8 w-8 text-primary/80 shrink-0"/>}
                      </div>
                      <div>
                          <h4 className="font-bold">{sermon.title}</h4>
                          <p className="text-sm text-muted-foreground">{sermon.speaker} - {new Date(sermon.date).toLocaleDateString()}</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                    {sermon.audioUrl && (
                        <Button variant="outline" asChild>
                            <a href={sermon.audioUrl} target="_blank" rel="noopener noreferrer">Listen</a>
                        </Button>
                    )}
                    {sermon.videoUrl && (
                        <Button variant="outline" asChild>
                            <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer">Watch</a>
                        </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-12">
                <Button asChild>
                    <Link href="/sermons">View Full Sermon Archive</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Events Calendar Section */}
      <section id="events" className="py-16 lg:py-24 bg-secondary/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Join us for fellowship, growth, and community activities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => {
              const Icon = eventIconMap[event.title] || eventIconMap.default;
              return (
              <Card key={index} className="flex flex-col bg-card shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                         <Icon className="h-6 w-6" />
                      </div>
                      <div>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <p className="text-sm text-primary font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm font-medium text-muted-foreground">Time: {event.time}</p>
                </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section id="ministries" className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Ministries</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Find your place to serve and grow within our church family.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ministries.map((ministry, index) => {
              const Icon = iconMap[ministry.name] || iconMap.default;
              return (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow flex flex-col bg-card overflow-hidden">
                  <CardHeader className="p-0">
                       <div className="aspect-video relative">
                          <Image src={ministry.imageUrl || 'https://placehold.co/600x400.png'} alt={ministry.name} fill style={{objectFit: 'cover'}} data-ai-hint="church ministry" />
                       </div>
                  </CardHeader>
                <CardContent className="flex-grow p-6">
                  <h3 className="text-2xl font-bold mb-2">{ministry.name}</h3>
                  <p className="text-muted-foreground">{ministry.description}</p>
                </CardContent>
                 <CardFooter className="flex justify-center pt-0">
                   <Button variant="link" asChild className="text-primary font-bold">
                    <Link href="/ministries">
                        Learn More <ArrowRight className="ml-2 h-4 w-4"/>
                    </Link>
                    </Button>
                 </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </section>
    </>
  );
}
