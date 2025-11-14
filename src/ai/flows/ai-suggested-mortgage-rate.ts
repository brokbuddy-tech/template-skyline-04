'use server';
/**
 * @fileOverview An AI agent that suggests a mortgage rate.
 *
 * - getAISuggestedMortgageRate - A function that returns an AI-suggested mortgage rate.
 * - AISuggestedMortgageRateInput - The input type for the getAISuggestedMortgageRate function.
 * - AISuggestedMortgageRateOutput - The return type for the getAISuggestedMortgageRate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISuggestedMortgageRateInputSchema = z.object({
  loanAmount: z.number().describe('The amount of the loan.'),
  loanTerm: z.number().describe('The term of the loan in years.'),
  creditScore: z.number().describe('The credit score of the borrower.'),
  propertyType: z.string().describe('The type of property being purchased.'),
  location: z.string().describe('The location of the property.'),
  downPaymentPercentage: z
    .number()
    .describe('The percentage of the property value paid as a down payment.'),
});
export type AISuggestedMortgageRateInput = z.infer<typeof AISuggestedMortgageRateInputSchema>;

const AISuggestedMortgageRateOutputSchema = z.object({
  suggestedRate: z.number().describe('The AI-suggested mortgage rate.'),
  explanation: z
    .string()
    .describe('An explanation of why this rate is suggested.'),
});
export type AISuggestedMortgageRateOutput = z.infer<typeof AISuggestedMortgageRateOutputSchema>;

export async function getAISuggestedMortgageRate(
  input: AISuggestedMortgageRateInput
): Promise<AISuggestedMortgageRateOutput> {
  return aiSuggestedMortgageRateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestedMortgageRatePrompt',
  input: {schema: AISuggestedMortgageRateInputSchema},
  output: {schema: AISuggestedMortgageRateOutputSchema},
  prompt: `You are an expert mortgage rate advisor. Based on the following information, suggest a reasonable mortgage rate.

Loan Amount: {{{loanAmount}}}
Loan Term (years): {{{loanTerm}}}
Credit Score: {{{creditScore}}}
Property Type: {{{propertyType}}}
Location: {{{location}}}
Down Payment Percentage: {{{downPaymentPercentage}}}

Provide a suggested mortgage rate and a brief explanation of why this rate is suggested. Be realistic and take into account current market conditions.

Format your response as a JSON object.
`,
});

const aiSuggestedMortgageRateFlow = ai.defineFlow(
  {
    name: 'aiSuggestedMortgageRateFlow',
    inputSchema: AISuggestedMortgageRateInputSchema,
    outputSchema: AISuggestedMortgageRateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
