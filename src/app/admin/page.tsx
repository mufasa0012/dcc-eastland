
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookUser, Mic, Calendar, Users, HandHelping, Church, LayoutTemplate, Phone, MessageSquareQuote, Database, BookHeart } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { name: 'Hero Section', icon: LayoutTemplate, href: '/admin/hero', description: 'Edit the homepage hero section.' },
  { name: 'Sermons', icon: Mic, href: '/admin/sermons', description: 'Manage sermon recordings and details.' },
  { name: 'Events', icon: Calendar, href: '/admin/events', description: 'Create and update church events.' },
  { name: 'Requests', icon: MessageSquareQuote, href: '/admin/requests', description: 'View notes from sacrifice givings.' },
  { name: 'Leadership', icon: Users, href: '/admin/leadership', description: 'Update leadership team information.' },
  { name: 'Ministries', icon: HandHelping, href: '/admin/ministries', description: 'Manage individual ministry pages.' },
  { name: 'Ministries Page', icon: BookHeart, href: '/admin/ministries-page', description: 'Edit the main ministries page content.' },
  { name: 'About Us', icon: Church, href: '/admin/about', description: 'Edit mission, beliefs, and history.' },
  { name: 'Contact Info', icon: Phone, href: '/admin/contact', description: 'Update address, phone, and email.' },
  { name: 'Database Setup', icon: Database, href: '/admin/setup', description: 'One-time data seeding for the site.' },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to the content management system. Select a section to start editing.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.name}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{item.name}</CardTitle>
                <item.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
