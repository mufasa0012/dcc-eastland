
'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getAboutContent, saveAboutContent } from "@/services/aboutService";
import { Skeleton } from "@/components/ui/skeleton";


const formSchema = z.object({
  identity: z.string().min(10, "Identity statement must be at least 10 characters."),
  mission: z.string().min(10, "Mission statement must be at least 10 characters."),
  beliefs: z.string().min(10, "Beliefs statement must be at least 10 characters."),
  history: z.string().min(10, "History must be at least 10 characters."),
  vision: z.string().min(10, "Vision statement must be at least 10 characters."),
});

export default function AboutAdminPage() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identity: "",
      mission: "",
      beliefs: "",
      history: "",
      vision: "",
    },
  });

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      setIsLoading(true);
      try {
        const content = await getAboutContent();
        if (content && isMounted) {
            form.reset(content);
        }
      } catch (error) {
        if (isMounted) {
            toast({
            title: "Error",
            description: "Failed to load content.",
            variant: "destructive",
            });
        }
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    }
    loadContent();

    return () => {
        isMounted = false;
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await saveAboutContent(values);
      if (result.success) {
        toast({
          title: "Changes Saved!",
          description: "The 'About Us' content has been updated.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>About Us</CardTitle>
        <CardDescription>Edit the content for your church's about page.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Our Identity</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Our Mission</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beliefs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Our Beliefs</FormLabel>
                  <FormControl>
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="history"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Our History</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Our Vision</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
        )}
      </CardContent>
    </Card>
  );
}
