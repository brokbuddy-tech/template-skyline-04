export type AISuggestedMortgageRateInput = {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  propertyType: string;
  location: string;
  downPaymentPercentage: number;
};

export type AISuggestedMortgageRateOutput = {
  suggestedRate: number;
  explanation: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export async function getAISuggestedMortgageRate(
  input: AISuggestedMortgageRateInput
): Promise<AISuggestedMortgageRateOutput> {
  const creditScore = clamp(input.creditScore, 300, 850);
  const downPayment = clamp(input.downPaymentPercentage, 0, 100);
  const loanTerm = clamp(input.loanTerm, 5, 35);

  let suggestedRate = 5.35;

  if (creditScore >= 780) suggestedRate -= 0.4;
  else if (creditScore >= 740) suggestedRate -= 0.25;
  else if (creditScore >= 700) suggestedRate -= 0.1;
  else if (creditScore < 650) suggestedRate += 0.45;
  else if (creditScore < 600) suggestedRate += 0.75;

  if (downPayment >= 35) suggestedRate -= 0.25;
  else if (downPayment >= 25) suggestedRate -= 0.15;
  else if (downPayment < 20) suggestedRate += 0.35;

  if (loanTerm >= 30) suggestedRate += 0.2;
  else if (loanTerm <= 15) suggestedRate -= 0.15;

  if (/villa|house|townhouse/i.test(input.propertyType)) suggestedRate += 0.05;
  if (/off[\s-]?plan|construction/i.test(input.propertyType)) suggestedRate += 0.2;
  if (/dubai|abu dhabi|uae/i.test(input.location)) suggestedRate += 0.1;

  const roundedRate = Number(clamp(suggestedRate, 3.25, 9.95).toFixed(2));
  const explanationParts = [
    `Estimated from a ${downPayment.toFixed(0)}% down payment`,
    `a ${loanTerm}-year term`,
    `and a credit score of ${creditScore}.`,
  ];

  if (roundedRate <= 5) {
    explanationParts.push('Your inputs point to a strong borrowing profile, so the rate skews toward the lower end.');
  } else if (roundedRate >= 6.25) {
    explanationParts.push('The suggested rate is slightly higher because the profile carries more lender risk than average.');
  } else {
    explanationParts.push('The result lands near a typical market rate for a balanced borrower profile.');
  }

  return {
    suggestedRate: roundedRate,
    explanation: explanationParts.join(' '),
  };
}
