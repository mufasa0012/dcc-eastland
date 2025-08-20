
import { getAboutContent, AboutContent } from '@/services/aboutService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Cross, BookOpen, Eye, Fingerprint } from 'lucide-react';
import Image from 'next/image';

const iconMap: { [key: string]: React.ElementType } = {
  identity: Fingerprint,
  mission: Church,
  beliefs: Cross,
  history: BookOpen,
  vision: Eye,
};

export default async function AboutPage() {
  const aboutContent = await getAboutContent();

  const contentSections = aboutContent ? [
    {
        key: 'identity' as keyof AboutContent,
        title: "Our Identity",
        description: aboutContent.identity,
    },
    {
        key: 'mission' as keyof AboutContent,
        title: "Our Mission",
        description: aboutContent.mission,
    },
    {
        key: 'beliefs' as keyof AboutContent,
        title: "Our Beliefs",
        description: aboutContent.beliefs,
    },
    {
        key: 'history' as keyof AboutContent,
        title: "Our History",
        description: aboutContent.history,
    },
    {
        key: 'vision' as keyof AboutContent,
        title: "Our Vision",
        description: aboutContent.vision,
    },
  ] : [];


  return (
    <>
      <section className="relative h-60 flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1600x400.png"
          alt="Cross on a hill at sunset"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute z-0"
          data-ai-hint="cross sunset"
          priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 container px-4">
          <h1 className="text-4xl md:text-5xl font-black drop-shadow-lg">
            About DCC Eastland
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md mt-2">
            Learn more about our community, our faith, and where we've come from.
          </p>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-secondary/10">
        <div className="container px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {contentSections.filter(section => section.description).map((section) => {
                    const Icon = iconMap[section.key];
                    return (
                        <Card key={section.key} className="shadow-lg border-l-4 border-primary">
                            <CardHeader className="flex flex-row items-center gap-6 space-y-0">
                                 <div className="bg-primary/10 text-primary p-4 rounded-full">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <CardTitle className="text-3xl font-bold">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg text-muted-foreground ml-20 leading-relaxed">
                                    {section.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
      </section>
    </>
  );
}
