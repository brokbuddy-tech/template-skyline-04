'use server';
/**
 * @fileOverview This file implements the Genkit flow for the IntelligentAIPropertySearch story.
 *
 * - intelligentAIPropertySearch - A function that handles the AI-powered property search.
 * - IntelligentAIPropertySearchInput - The input type for the intelligentAIPropertySearch function.
 * - IntelligentAIPropertySearchOutput - The return type for the intelligentAIPropertySearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentAIPropertySearchInputSchema = z.object({
  query: z.string().describe('The natural language query for property search.'),
});
export type IntelligentAIPropertySearchInput = z.infer<typeof IntelligentAIPropertySearchInputSchema>;

const IntelligentAIPropertySearchOutputSchema = z.object({
  propertyIds: z.array(z.string()).describe('An array of property IDs that match the query.'),
});
export type IntelligentAIPropertySearchOutput = z.infer<typeof IntelligentAIPropertySearchOutputSchema>;

export async function intelligentAIPropertySearch(input: IntelligentAIPropertySearchInput): Promise<IntelligentAIPropertySearchOutput> {
  return intelligentAIPropertySearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentAIPropertySearchPrompt',
  input: {schema: IntelligentAIPropertySearchInputSchema},
  output: {schema: IntelligentAIPropertySearchOutputSchema},
  prompt: `You are an AI real estate expert. Given the following search query, identify the properties that best match the user's needs.

Query: {{{query}}}

Return a list of property IDs that match the query.

For example:
{
  "propertyIds": ["123", "456", "789"]
}

Only return valid IDs. You MUST respond in JSON format.`,}
);

const intelligentAIPropertySearchFlow = ai.defineFlow(
  {
    name: 'intelligentAIPropertySearchFlow',
    inputSchema: IntelligentAIPropertySearchInputSchema,
    outputSchema: IntelligentAIPropertySearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
