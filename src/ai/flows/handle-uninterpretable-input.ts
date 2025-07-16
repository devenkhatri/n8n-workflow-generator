'use server';
/**
 * @fileOverview Handles uninterpretable input by returning a warning message.
 *
 * - handleUninterpretableInput - A function that returns a predefined warning message.
 * - UninterpretableInput - The input type for the handleUninterpretableInput function.
 * - UninterpretableOutput - The return type for the handleUninterpretableInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UninterpretableInputSchema = z.object({
  userInput: z.string().describe('The user input that could not be interpreted.'),
});
export type UninterpretableInput = z.infer<typeof UninterpretableInputSchema>;

const UninterpretableOutputSchema = z.object({
  warningMessage: z
    .string()
    .describe('A warning message indicating that the input could not be interpreted.'),
});
export type UninterpretableOutput = z.infer<typeof UninterpretableOutputSchema>;

export async function handleUninterpretableInput(
  input: UninterpretableInput
): Promise<UninterpretableOutput> {
  return handleUninterpretableInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'uninterpretableInputPrompt',
  input: {schema: UninterpretableInputSchema},
  output: {schema: UninterpretableOutputSchema},
  prompt: `The user input "{{{userInput}}}" could not be interpreted. Return a warning message.`,
});

const handleUninterpretableInputFlow = ai.defineFlow(
  {
    name: 'handleUninterpretableInputFlow',
    inputSchema: UninterpretableInputSchema,
    outputSchema: UninterpretableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
