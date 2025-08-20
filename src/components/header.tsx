
"use client";

import Link from "next/link";
import { Cross, Menu, Gift, ChevronDown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { Textarea } from "./ui/textarea";
import { addRequest } from "@/services/requestService";
import { Input } from "./ui/input";

const givingOptions = [
    { label: "Tithe", paybill: "247247", account: "013011" },
    { label: "Offering/Sadaka", paybill: "247247", account: "013011" },
    { label: "Thanksgiving", paybill: "247247", account: "013011" },
    { label: "Sacrifice", paybill: "247247", account: "013011" },
];

type GivingOption = typeof givingOptions[0];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGivingDialogOpen, setIsGivingDialogOpen] = useState(false);
  const [selectedGivingOption, setSelectedGivingOption] = useState<GivingOption | null>(null);
  const [sacrificeNote, setSacrificeNote] = useState("");
  const [sacrificePhone, setSacrificePhone] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleGivingSelect = (option: GivingOption) => {
    setSelectedGivingOption(option);
    setSacrificeNote(""); // Reset note on new selection
    setSacrificePhone(""); // Reset phone on new selection
    setIsGivingDialogOpen(true);
    // Close mobile menus if open
    setIsMobileMenuOpen(false);
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: "Copied to Clipboard",
        description: `${label} has been copied.`,
    });
  }

  const handleSendRequest = () => {
    if (!sacrificeNote.trim()) {
        toast({
            title: "Note is empty",
            description: "Please enter a note before sending.",
            variant: "destructive"
        });
        return;
    }
    startTransition(async () => {
        const result = await addRequest(sacrificeNote, sacrificePhone);
        if (result.success) {
            toast({
                title: "Request Sent",
                description: "Your note has been submitted successfully.",
            });
            setIsGivingDialogOpen(false);
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive"
            });
        }
    });
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Cross className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg font-headline hidden sm:inline-block">
            DCC Eastland
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="hidden sm:flex" variant="secondary">
                        <Gift className="mr-2 h-4 w-4" /> Give Online <ChevronDown className="ml-2 h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {givingOptions.map((option) => (
                         <DropdownMenuItem key={option.label} onClick={() => handleGivingSelect(option)}>
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                   <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Cross className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">DCC Eastland</span>
                  </Link>
                </div>
                <nav className="flex flex-col gap-4 mt-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-full">
                                <Gift className="mr-2 h-4 w-4" /> Give Online <ChevronDown className="ml-2 h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-[calc(100vw-2rem)]">
                             {givingOptions.map((option) => (
                                <DropdownMenuItem key={option.label} onClick={() => handleGivingSelect(option)}>
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    <Dialog open={isGivingDialogOpen} onOpenChange={setIsGivingDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Give via M-Pesa for {selectedGivingOption?.label}</DialogTitle>
                <DialogDescription>
                    {selectedGivingOption?.label === 'Sacrifice'
                        ? "Use the details below. You can also add a note or phone number to send with your request."
                        : "Use the details below to complete your contribution."
                    }
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <p className="font-semibold">Paybill Number:</p>
                    <div className="flex items-center justify-between rounded-md bg-secondary p-3">
                       <span className="font-mono text-lg">{selectedGivingOption?.paybill}</span>
                       <Button variant="ghost" size="icon" onClick={() => copyToClipboard(selectedGivingOption?.paybill || '', 'Paybill Number')}>
                           <Copy className="h-4 w-4" />
                       </Button>
                    </div>
                </div>
                 <div className="space-y-2">
                    <p className="font-semibold">Account Number:</p>
                    <div className="flex items-center justify-between rounded-md bg-secondary p-3">
                        <span className="font-mono text-lg">{selectedGivingOption?.account}</span>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(selectedGivingOption?.account || '', 'Account Number')}>
                           <Copy className="h-4 w-4" />
                       </Button>
                    </div>
                </div>
                {selectedGivingOption?.label === 'Sacrifice' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <p className="font-semibold">Add a note or prayer request:</p>
                            <Textarea 
                                placeholder="Type your message here..." 
                                value={sacrificeNote}
                                onChange={(e) => setSacrificeNote(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                         <div className="space-y-2">
                            <p className="font-semibold">Phone Number (Optional):</p>
                            <Input
                                type="tel"
                                placeholder="Your phone number"
                                value={sacrificePhone}
                                onChange={(e) => setSacrificePhone(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>
                )}
            </div>
            {selectedGivingOption?.label === 'Sacrifice' && (
                <DialogFooter>
                    <Button onClick={handleSendRequest} disabled={isPending}>
                        {isPending ? 'Sending...' : 'Send Request'}
                    </Button>
                </DialogFooter>
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/#sermons", label: "Sermons" },
  { href: "/#events", label: "Events" },
  { href: "/ministries", label: "Ministries" },
  { href: "#contact", label: "Contact" },
];
