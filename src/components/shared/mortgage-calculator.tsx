"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getAISuggestedMortgageRate, AISuggestedMortgageRateOutput } from "@/ai/flows/ai-suggested-mortgage-rate";

interface MortgageCalculatorProps {
    propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
    const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8);
    const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
    const [interestRate, setInterestRate] = useState(5.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<AISuggestedMortgageRateOutput | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleDownPaymentChange = (value: number) => {
        setDownPayment(value);
        setLoanAmount(propertyPrice - value);
    };

    const handleLoanAmountChange = (value: number) => {
        setLoanAmount(value);
        setDownPayment(propertyPrice - value);
    };

    const calculateMonthlyPayment = () => {
        const principal = loanAmount;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (principal > 0 && monthlyInterestRate > 0) {
            const payment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
            setMonthlyPayment(payment.toFixed(2));
        } else {
            setMonthlyPayment(null);
        }
    };
    
    const handleGetSuggestion = async () => {
        setIsSuggesting(true);
        setAiSuggestion(null);
        try {
            const suggestion = await getAISuggestedMortgageRate({
                loanAmount: loanAmount,
                loanTerm: loanTerm,
                creditScore: 740, // Example value
                propertyType: 'House', // Example value
                location: 'California', // Example value
                downPaymentPercentage: (downPayment / propertyPrice) * 100
            });
            setAiSuggestion(suggestion);
            if (suggestion.suggestedRate) {
                setInterestRate(suggestion.suggestedRate);
            }
        } catch (error) {
            console.error("Error getting AI suggestion:", error);
        } finally {
            setIsSuggesting(false);
        }
    };


    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return (
        <Card className="border-primary w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-4xl font-medium">Mortgage Estimator</CardTitle>
                <CardDescription>Estimate your monthly mortgage payment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="property-price">Property Price</Label>
                        <Input id="property-price" value={formatCurrency(propertyPrice)} readOnly className="bg-muted"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="down-payment">Down Payment</Label>
                        <Input id="down-payment" value={formatCurrency(downPayment)} onChange={e => handleDownPaymentChange(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Down Payment ({((downPayment / propertyPrice) * 100).toFixed(0)}%)</Label>
                    <Slider value={[downPayment]} onValueChange={([val]) => handleDownPaymentChange(val)} max={propertyPrice} step={1000} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                        <Input id="interest-rate" type="number" value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} step="0.1" />
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleGetSuggestion} disabled={isSuggesting}>
                          {isSuggesting ? 'Getting suggestion...' : 'Get AI Suggested Rate'}
                        </Button>
                         {aiSuggestion && (
                            <p className="text-sm text-muted-foreground mt-1">{aiSuggestion.explanation}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="loan-term">Loan Term (Years)</Label>
                        <Input id="loan-term" type="number" value={loanTerm} onChange={e => setLoanTerm(parseInt(e.target.value, 10))} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
                <Button size="lg" className="w-full" onClick={calculateMonthlyPayment}>Calculate</Button>
                {monthlyPayment && (
                    <div className="w-full text-center pt-4">
                        <p className="text-muted-foreground">Estimated Monthly Payment</p>
                        <p className="text-4xl font-bold font-headline">{formatCurrency(parseFloat(monthlyPayment))}</p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
