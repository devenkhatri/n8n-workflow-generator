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
  prompt: `You are an expert in designing n8n workflows. An n8n workflow is defined using JSON. Your task is to take a user's description of a desired workflow and generate a valid n8n JSON configuration.

The JSON must adhere to the following structure:
1.  **name**: A string for the workflow name.
2.  **nodes**: An array of node objects.
    *   Each node must have:
        *   \`id\`: A unique string identifier for the node.
        *   \`name\`: The display name of the node (e.g., "Start", "HTTP Request").
        *   \`type\`: The n8n node type (e.g., "n8n-nodes-base.start", "n8n-nodes-base.httpRequest").
        *   \`typeVersion\`: The version of the node type, which is crucial for compatibility. For most basic nodes, use version 1, 2, or higher as appropriate (e.g., use 2 for Start, 4.1 for HTTP Request, 2 for Set).
        *   \`position\`: An array of two numbers for the [x, y] coordinates on the canvas.
        *   \`parameters\`: An object containing the node's configuration settings.
3.  **connections**: An object defining the links between nodes. The key is the \`id\` of the source node. The value is an object, typically with a \`main\` property, which is an array of outputs. Each output is an array containing an object that specifies the target \`node\` id.

Here is an example of a simple workflow that gets data from an API and then sets a new field:
\`\`\`json
{
  "name": "My API Workflow",
  "nodes": [
    {
      "id": "e0e3712d-1b17-45f8-8b77-bd25f3c95945",
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "typeVersion": 2,
      "position": [
        250,
        300
      ],
      "parameters": {}
    },
    {
      "id": "5a443553-99b7-4a87-9578-15ab160759f2",
      "name": "HTTP Request",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.1,
      "position": [
        500,
        300
      ],
      "parameters": {
        "url": "https://api.example.com/data",
        "options": {}
      }
    },
    {
      "id": "f8a2f421-a3b1-4f1c-8e6d-54f3b2a9e3a7",
      "name": "Set",
      "type": "n8n-nodes-base.set",
      "typeVersion": 2,
      "position": [
        750,
        300
      ],
      "parameters": {
        "values": {
          "string": [
            {
              "name": "status",
              "value": "completed"
            }
          ]
        },
        "options": {}
      }
    }
  ],
  "connections": {
    "e0e3712d-1b17-45f8-8b77-bd25f3c95945": {
      "main": [
        [
          {
            "node": "5a443553-99b7-4a87-9578-15ab160759f2",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "5a443553-99b7-4a87-9578-15ab160759f2": {
      "main": [
        [
          {
            "node": "f8a2f421-a3b1-4f1c-8e6d-54f3b2a9e3a7",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
\`\`\`

Based on this schema, generate a valid n8n workflow JSON for the following user request.
IMPORTANT: Your entire response must be ONLY the raw JSON content, without any surrounding text, explanations, or markdown code blocks.
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
