
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  LeadershipMember,
  addLeadershipMember,
  updateLeadershipMember,
  uploadImage,
} from "@/services/leadershipService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";


const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  title: z.string().min(1, "Title is required."),
  imageUrl: z.string().url("A valid image URL is required."),
  imageFileId: z.string().optional(),
});

type LeadershipFormValues = z.infer<typeof formSchema>;

interface LeadershipFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  member: LeadershipMember | null;
}

export function LeadershipForm({ isOpen, setIsOpen, onSuccess, member }: LeadershipFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<LeadershipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      imageUrl: "",
      imageFileId: "",
    },
  });

  useEffect(() => {
    if (member) {
      form.reset(member);
      setImagePreview(member.imageUrl);
    } else {
      form.reset({ name: "", title: "", imageUrl: "", imageFileId: "" });
      setImagePreview(null);
    }
  }, [member, form, isOpen]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setIsUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadImage(formData);
      setIsUploading(false);

      if (result.success && result.url) {
        form.setValue('imageUrl', result.url, { shouldValidate: true });
        form.setValue('imageFileId', result.fileId);
        toast({ title: "Success", description: "Image uploaded successfully." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
        setImagePreview(member?.imageUrl || null); // Revert preview on failure
      }
    }
  };


  function onSubmit(values: LeadershipFormValues) {
    startTransition(async () => {
      const result = member
        ? await updateLeadershipMember(member.id, values)
        : await addLeadershipMember(values);

      if (result.success) {
        toast({
          title: "Success!",
          description: `Leadership member ${member ? 'updated' : 'added'}.`,
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
          <DialogTitle>{member ? "Edit Member" : "Add New Member"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>
                    <label htmlFor="image-upload">
                        <Avatar className="h-24 w-24 cursor-pointer border-2 border-dashed flex items-center justify-center hover:border-primary">
                        {imagePreview ? (
                            <AvatarImage src={imagePreview} alt="Member photo" className="object-cover"/>
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <Upload className="h-6 w-6"/>
                                <span className="text-xs">Upload Photo</span>
                            </div>
                        )}
                        <AvatarFallback>{form.getValues('name')?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </label>
                  </FormLabel>
                   <FormControl>
                        <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                      />
                  </FormControl>
                  {isUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Cancel
                </Button>
                </DialogClose>
              <Button type="submit" disabled={isPending || isUploading}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
