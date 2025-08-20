
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { Ministry } from "@/services/ministryService";
import { addMinistry, updateMinistry, uploadImage } from "@/services/ministryService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HandHelping, Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  imageUrl: z.string().url("A valid image URL is required.").optional(),
  imageFileId: z.string().optional(),
});

type MinistryFormValues = z.infer<typeof formSchema>;

interface MinistryFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
  ministry: Ministry | null;
}

export function MinistryForm({ isOpen, setIsOpen, onSuccess, ministry }: MinistryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<MinistryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      imageFileId: ""
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (ministry) {
          form.reset(ministry);
          setImagePreview(ministry.imageUrl || null);
        } else {
          form.reset({ name: "", description: "", imageUrl: "", imageFileId: "" });
          setImagePreview(null);
        }
    }
  }, [ministry, form, isOpen]);

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
        setImagePreview(ministry?.imageUrl || null); // Revert preview on failure
      }
    }
  };


  function onSubmit(values: MinistryFormValues) {
    startTransition(async () => {
      const result = ministry
        ? await updateMinistry(ministry.id, values)
        : await addMinistry(values);

      if (result.success) {
        toast({
          title: "Success!",
          description: `Ministry ${ministry ? 'updated' : 'added'}.`,
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
          <DialogTitle>{ministry ? "Edit Ministry" : "Add New Ministry"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>
                    <label htmlFor="image-upload-ministry">
                        <Avatar className="h-24 w-24 cursor-pointer border-2 border-dashed flex items-center justify-center hover:border-primary">
                        {imagePreview ? (
                            <AvatarImage src={imagePreview} alt="Ministry photo" className="object-cover"/>
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                <HandHelping className="h-6 w-6"/>
                                <span className="text-xs">Upload Photo</span>
                            </div>
                        )}
                        <AvatarFallback><HandHelping /></AvatarFallback>
                        </Avatar>
                    </label>
                  </FormLabel>
                   <FormControl>
                        <input
                        id="image-upload-ministry"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
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
