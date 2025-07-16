'use client';

import { useState } from 'react';
import { generateWorkflowFromDescription } from '@/ai/flows/generate-workflow-from-description';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Copy, Download, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [description, setDescription] = useState('');
  const [workflowJson, setWorkflowJson] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a description for your workflow.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setWorkflowJson('');

    try {
      const result = await generateWorkflowFromDescription({ description });
      // Prettify the JSON string
      const parsedJson = JSON.parse(result.workflowJson);
      const prettyJson = JSON.stringify(parsedJson, null, 2);
      setWorkflowJson(prettyJson);
    } catch (error) {
      console.error('Error generating workflow:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not interpret the request. Please try rephrasing.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!workflowJson) return;
    navigator.clipboard.writeText(workflowJson);
    toast({
      title: 'Success',
      description: 'JSON copied to clipboard!',
    });
  };

  const handleDownload = () => {
    if (!workflowJson) return;
    const blob = new Blob([workflowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            n8n Workflow Generator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your desired automation task in plain English, and our AI will generate the n8n workflow JSON for you.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">Describe Your Workflow</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-4">
                <Textarea
                  placeholder="e.g., 'When a new row is added to my Google Sheet, send an email notification via Gmail.'"
                  className="w-full flex-grow resize-none min-h-[300px] md:min-h-[400px] text-base"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Workflow
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-headline">Generated n8n JSON</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  disabled={!workflowJson || isLoading}
                  aria-label="Copy JSON"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                  disabled={!workflowJson || isLoading}
                  aria-label="Download JSON"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading ? (
                <Skeleton className="w-full h-full min-h-[300px] md:min-h-[400px]" />
              ) : (
                <Textarea
                  readOnly
                  placeholder="Your generated JSON will appear here..."
                  className="w-full h-full resize-none font-code text-sm bg-muted/50 min-h-[300px] md:min-h-[400px]"
                  value={workflowJson}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}