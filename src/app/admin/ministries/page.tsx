
'use client';

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, HandHelping } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MinistryForm } from "./MinistryForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Ministry } from "@/services/ministryService";
import { getMinistries, deleteMinistry } from "@/services/ministryService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MinistriesAdminPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchMinistries = async () => {
    setIsLoading(true);
    try {
      const ministryList = await getMinistries();
      setMinistries(ministryList);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load ministries.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleAdd = () => {
    setSelectedMinistry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setIsFormOpen(true);
  };

  const handleDelete = (ministryId: string) => {
    startTransition(async () => {
      const result = await deleteMinistry(ministryId);
      if (result.success) {
        toast({ title: "Success", description: "Ministry deleted." });
        fetchMinistries();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    });
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchMinistries();
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ministries</CardTitle>
              <CardDescription>Manage your church's ministries.</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Ministry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                ministries.map((ministry) => (
                  <TableRow key={ministry.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                          <AvatarImage src={ministry.imageUrl} alt={ministry.name} />
                          <AvatarFallback><HandHelping className="h-4 w-4 text-muted-foreground"/></AvatarFallback>
                        </Avatar>
                        <span>{ministry.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ministry.description}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(ministry)}>Edit</DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the ministry "{ministry.name}".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(ministry.id)} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                                 {isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <MinistryForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        onSuccess={handleFormSuccess}
        ministry={selectedMinistry}
      />
    </>
  );
}
