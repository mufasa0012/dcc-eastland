
'use client';

import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BookUser,
  Church,
  Home,
  Mic,
  Calendar,
  Settings,
  Users,
  LogOut,
  HandHelping,
  LayoutTemplate,
  Gift,
  Phone,
  MessageSquareQuote,
  Database,
  BookHeart,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cross } from 'lucide-react';

function AdminSidebarInner() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/hero', icon: LayoutTemplate, label: 'Hero Section' },
    { href: '/admin/sermons', icon: Mic, label: 'Sermons' },
    { href: '/admin/events', icon: Calendar, label: 'Events' },
    { href: '/admin/requests', icon: MessageSquareQuote, label: 'Requests' },
    { href: '/admin/leadership', icon: Users, label: 'Leadership' },
    { href: '/admin/ministries', icon: HandHelping, label: 'Ministries' },
    { href: '/admin/ministries-page', icon: BookHeart, label: 'Ministries Page' },
    { href: '/admin/about', icon: Church, label: 'About Us' },
    { href: '/admin/contact', icon: Phone, label: 'Contact Info' },
    { href: '/admin/setup', icon: Database, label: 'DB Setup' },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <Cross className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg font-headline">
            DCC Eastland CMS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label }}
                onClick={handleLinkClick}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/">
                <LogOut />
                <span>Back to Site</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/30">
        <AdminSidebarInner />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="md:hidden flex justify-end mb-4">
             <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
