
'use client';

import Link from 'next/link';
import { Cross, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { getContactInfo, ContactInfo } from '@/services/contactService';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1-1.4-6.1-7.9-12.2-11.4C6.1 2.8 3.3 6.3 3.3 6.3s-3.2 8.3 4.1 11.4c-1 .8-2.5.8-3.3 0 0 0 2.5 4.1 8.2 4.1 4.1 0 7.3-3.3 7.3-7.4 0-.1 0-.1 0-.2.7-.5 1.4-1.1 2-1.8z" />
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);


const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.98-1.55-1.99-2.09-4.38-1.74-6.81.24-1.6.83-3.18 1.81-4.59 1.28-1.9 3.25-3.21 5.43-3.46 1.76-.19 3.54-.04 5.31.02v4.03c-1.74-.01-3.48-.02-5.21-.02-1.26-.01-2.52.34-3.51 1.15-.59.48-1.04 1.14-1.32 1.86-.25.66-.35 1.37-.41 2.08-.09 1.08-.02 2.17.21 3.24.29 1.28.89 2.47 1.82 3.39.99 1.01 2.32 1.54 3.79 1.52 1.4-.02 2.74-.56 3.65-1.58.85-.95 1.29-2.17 1.32-3.44.03-1.44-.01-2.89-.01-4.33-.01-2.31-.01-4.63-.01-6.94-.02-1.51-.02-3.02 0-4.53Z" />
    </svg>
  );

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    async function fetchContactInfo() {
        const info = await getContactInfo();
        setContactInfo(info);
    }
    fetchContactInfo();
  }, []);

  return (
    <footer id="contact" className="bg-secondary/50 text-secondary-foreground border-t">
      <div className="container py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <Cross className="h-10 w-10 text-primary" />
              <div>
                <span className="text-xl font-bold font-headline block">DISCIPLE OF CHRIST CHURCH</span>
                <span className="text-muted-foreground">Eastland Parish</span>
              </div>
            </Link>
            <div className="space-y-3 pt-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 mt-1 text-primary shrink-0" />
                  <span>{contactInfo?.address || 'Loading...'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>{contactInfo?.phone || 'Loading...'}</span>
                </div>
                 <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>{contactInfo?.email || 'Loading...'}</span>
                </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <a href="https://facebook.com/Dcceastlandchurch" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon className="h-6 w-6 text-[#1877F2] fill-[#1877F2] stroke-none" />
              </a>
              <a href="https://twitter.com/Dcceastlandchurch" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <TwitterIcon className="h-6 w-6 text-[#1DA1F2] fill-[#1DA1F2] stroke-none" />
              </a>
              <a href="https://instagram.com/Dcceastlandchurch" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                 <InstagramIcon className="h-6 w-6" style={{ color: 'transparent', stroke: 'url(#instagram-gradient)', strokeWidth: 2 }} />
                 <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                        <radialGradient id="instagram-gradient" cx="0.3" cy="1" r="1">
                        <stop offset="0" stopColor="#FFD600" />
                        <stop offset="0.1" stopColor="#FFD600" />
                        <stop offset="0.5" stopColor="#FF6900" />
                        <stop offset="1" stopColor="#D82C8A" />
                        </radialGradient>
                    </defs>
                 </svg>
              </a>
              <a href="https://tiktok.com/@eastlighttv24" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <TikTokIcon className="h-6 w-6 text-black" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-bold mb-4 font-headline">Get In Touch</h3>
            <p className="text-muted-foreground mb-6">Have questions or want to learn more? Send us a message.</p>
            {contactInfo?.email ? (
              <form action={`mailto:${contactInfo.email}`} method="get" encType="text/plain" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input name="name" placeholder="Your Name" required className="bg-background" aria-label="Your Name" />
                  <Input name="email" type="email" placeholder="Your Email" required className="bg-background" aria-label="Your Email"/>
                </div>
                <Input name="subject" placeholder="Subject" required className="bg-background" aria-label="Subject"/>
                <Textarea name="body" placeholder="Your Message" rows={5} required className="bg-background" aria-label="Your Message"/>
                <Button type="submit" className="w-full sm:w-auto font-bold">Send Message</Button>
              </form>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </div>
                    <Skeleton className="h-10" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            )}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Disciple of Christ Church Eastland. All Rights Reserved. {' | '} <Link href="/admin" className="hover:text-primary underline">Admin Login</Link></p>
        </div>
      </div>
    </footer>
  );
}
