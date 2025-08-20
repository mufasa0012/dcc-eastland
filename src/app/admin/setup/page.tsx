
'use client'

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { seedDatabase } from "@/services/setupService";
import { toast } from "@/hooks/use-toast";


export default function SetupPage() {
    const [isPending, startTransition] = useTransition();
    const [logs, setLogs] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);

    const handleSeed = () => {
        startTransition(async () => {
            setLogs([]);
            setIsFinished(false);
            const results = await seedDatabase();

            if (results.success) {
                setLogs(results.logs);
                setIsFinished(true);
                 toast({
                    title: "Database Seeded!",
                    description: "Initial data has been populated.",
                });
            } else {
                 toast({
                    title: "Error",
                    description: results.message,
                    variant: "destructive",
                });
                setLogs([`Error: ${results.message}`]);
                setIsFinished(true);
            }
        });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>
            Run this one-time process to seed your Firestore database with the initial content for the website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
                Running this process will overwrite any existing data in the content collections (sermons, events, etc.). Only run this on a fresh database setup.
            </AlertDescription>
        </Alert>

        <Button onClick={handleSeed} disabled={isPending}>
            {isPending ? 'Seeding Database...' : 'Start Database Seed'}
        </Button>

        {logs.length > 0 && (
            <div className="space-y-2">
                <h3 className="font-semibold">Logs:</h3>
                <div className="p-4 bg-secondary rounded-md text-sm text-secondary-foreground max-h-60 overflow-y-auto">
                    {logs.map((log, index) => (
                        <p key={index} className="font-mono whitespace-pre-wrap">{log}</p>
                    ))}
                </div>
            </div>
        )}
        {isFinished && !isPending && (
             <Alert variant="default" className="border-primary">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Process Complete</AlertTitle>
                <AlertDescription>
                    The database seeding process has finished. You can now manage this content via the admin dashboard. You may want to remove this setup page now.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
