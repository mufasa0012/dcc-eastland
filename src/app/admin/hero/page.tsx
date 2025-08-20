
'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";

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
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getHeroContent, saveHeroContent, uploadHeroImage } from "@/services/heroService";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload } from "lucide-react";


const formSchema = z.object({
  headline: z.string().min(1, "Headline is required."),
  subheadline: z.string().min(1, "Sub-headline is required."),
  serviceTimes: z.string().min(1, "Service times are required."),
  address: z.string().min(1, "Address is required."),
  buttonText: z.string().min(1, "Button text is required."),
  imageUrl: z.string().url("A valid image URL is required."),
  imageFileId: z.string().optional(),
});

export default function HeroAdminPage() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headline: "",
      subheadline: "",
      serviceTimes: "",
      address: "",
      buttonText: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      setIsLoading(true);
      try {
        const content = await getHeroContent();
        if (content && isMounted) {
            form.reset(content);
            setImagePreview(content.imageUrl);
        }
      } catch (error) {
        if (isMounted) {
            toast({
            title: "Error",
            description: "Failed to load hero content.",
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

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadHeroImage(formData);
      setIsUploading(false);

      if (result.success && result.url) {
        form.setValue('imageUrl', result.url, { shouldValidate: true });
        form.setValue('imageFileId', result.fileId);
        toast({ title: "Success", description: "Image uploaded successfully." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
        // Revert preview on failure
        getHeroContent().then(content => setImagePreview(content.imageUrl));
      }
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await saveHeroContent(values);
      if (result.success) {
        toast({
          title: "Changes Saved!",
          description: "The Hero Section content has been updated.",
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
        <CardTitle>Hero Section</CardTitle>
        <CardDescription>Edit the content for your homepage's hero section.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                     <label htmlFor="image-upload" className="relative block w-full h-64 cursor-pointer rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:border-primary">
                        <input
                            id="image-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading}
                        />
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Hero background" fill className="object-cover rounded-md" />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-8 w-8" />
                                <span>{isUploading ? "Uploading..." : "Click or drag to upload"}</span>
                            </div>
                        )}
                         {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                <p className="text-white">Uploading...</p>
                            </div>
                         )}
                     </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subheadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-headline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="serviceTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Times</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isPending || isUploading}>
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
