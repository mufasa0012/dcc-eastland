
'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useTransition } from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { Sermon } from "@/services/sermonService";
import { addSermon, updateSermon } from "@/services/sermonService";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  speaker: z.string().min(1, "Speaker is required."),
  date: z.date({
    required_error: "A date is required.",
  }),
  audioUrl: z.string().url("A valid audio URL is required.").optional().or(z.literal('')),
  videoUrl: z.string().url("A valid video URL is required.").optional().or(z.literal('')),
}).refine(data => data.audioUrl || data.videoUrl, {
    message: "At least one URL (Audio or Video) must be provided.",
    path: ["audioUrl"], // you can use any path here, it will be a form-level error
});


type SermonFormValues = z.infer<typeof formSchema>;

interface SermonFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  sermon: Sermon | null;
}

export function SermonForm({ isOpen, setIsOpen, onSuccess, sermon }: SermonFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SermonFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      speaker: "",
      audioUrl: "",
      videoUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (sermon) {
          form.reset({
            ...sermon,
            date: new Date(sermon.date),
          });
        } else {
          form.reset({ title: "", speaker: "", date: new Date(), audioUrl: "", videoUrl: "" });
        }
    }
  }, [sermon, form, isOpen]);


  function onSubmit(values: SermonFormValues) {
    const dataToSave = {
        ...values,
        date: values.date.toISOString(),
    }
    startTransition(async () => {
      const result = sermon
        ? await updateSermon(sermon.id, dataToSave)
        : await addSermon(dataToSave);

      if (result.success) {
        toast({
          title: "Success!",
          description: `Sermon ${sermon ? 'updated' : 'added'}.`,
        });
        onSuccess();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{sermon ? "Edit Sermon" : "Add New Sermon"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="speaker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Speaker</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="audioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Audio URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..."/>
                  </FormControl>
                  <FormDescription>
                    Provide a URL for the audio recording.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..."/>
                  </FormControl>
                  <FormDescription>
                    Provide a URL for the video recording (e.g., YouTube).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
                </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
