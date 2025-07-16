'use server';
/**
 * @fileOverview Converts user input into a valid n8n workflow JSON definition.
 *
 * - generateWorkflowFromDescription - A function that handles the workflow generation process.
 * - GenerateWorkflowFromDescriptionInput - The input type for the generateWorkflowFromDescription function.
 * - GenerateWorkflowFromDescriptionOutput - The return type for the generateWorkflowFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkflowFromDescriptionInputSchema = z.object({
  description: z.string().describe('The description of the desired n8n workflow.'),
});
export type GenerateWorkflowFromDescriptionInput = z.infer<typeof GenerateWorkflowFromDescriptionInputSchema>;

const GenerateWorkflowFromDescriptionOutputSchema = z.object({
  workflowJson: z.string().describe('The generated n8n workflow JSON configuration.'),
});
export type GenerateWorkflowFromDescriptionOutput = z.infer<typeof GenerateWorkflowFromDescriptionOutputSchema>;

export async function generateWorkflowFromDescription(input: GenerateWorkflowFromDescriptionInput): Promise<GenerateWorkflowFromDescriptionOutput> {
  return generateWorkflowFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkflowFromDescriptionPrompt',
  input: {schema: GenerateWorkflowFromDescriptionInputSchema},
  output: {schema: GenerateWorkflowFromDescriptionOutputSchema},
  prompt: `You are an expert in designing n8n workflows.  An n8n workflow is defined using JSON.

You will take a user's description of a desired n8n workflow, and generate a JSON configuration representing that workflow.  The JSON must be valid and well-formatted.

Only use nodes available in the n8n community edition.

Description: {{{description}}}`,
});

const generateWorkflowFromDescriptionFlow = ai.defineFlow(
  {
    name: 'generateWorkflowFromDescriptionFlow',
    inputSchema: GenerateWorkflowFromDescriptionInputSchema,
    outputSchema: GenerateWorkflowFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
