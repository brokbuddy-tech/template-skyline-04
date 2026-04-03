"use client";

import { useState, useContext } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getAISuggestedMortgageRate, AISuggestedMortgageRateOutput } from "@/ai/flows/ai-suggested-mortgage-rate";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CurrencyContext } from "@/context/currency-context";

interface MortgageCalculatorProps {
    propertyPrice: number;
}

interface ChartData {
    name: string;
    value: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
    const { currency, formatPrice, convertFromUSD } = useContext(CurrencyContext);

    const convertedPropertyPrice = convertFromUSD(propertyPrice);

    const [loanAmount, setLoanAmount] = useState(convertedPropertyPrice * 0.8);
    const [downPayment, setDownPayment] = useState(convertedPropertyPrice * 0.2);
    const [interestRate, setInterestRate] = useState(5.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthlyPayment, setMonthlyPayment] = useState<string | null>(null);
    const [chartData, setChartData] = useState<ChartData[] | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<AISuggestedMortgageRateOutput | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleDownPaymentChange = (value: number) => {
        setDownPayment(value);
        setLoanAmount(convertedPropertyPrice - value);
    };
    
    const handleLoanAmountChange = (value: number) => {
        setLoanAmount(value);
        setDownPayment(convertedPropertyPrice - value);
    };

    const calculateMonthlyPayment = () => {
        const principal = loanAmount;
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (principal > 0 && monthlyInterestRate > 0) {
            const payment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
            setMonthlyPayment(payment.toFixed(2));

            const totalPaid = payment * numberOfPayments;
            const totalInterest = totalPaid - principal;
            
            setChartData([
                { name: 'Principal', value: principal },
                { name: 'Interest', value: totalInterest },
            ]);

        } else {
            setMonthlyPayment(null);
            setChartData(null);
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
                downPaymentPercentage: (downPayment / convertedPropertyPrice) * 100
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

    const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];

    return (
        <Card className="border-accent w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-4xl font-medium">Mortgage Estimator</CardTitle>
                <CardDescription>Estimate your monthly mortgage payment and total costs.</CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="property-price">Property Price</Label>
                                <Input id="property-price" value={formatPrice(propertyPrice)} readOnly className="bg-muted"/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="down-payment">Down Payment</Label>
                                <Input id="down-payment" value={formatPrice(downPayment, false)} onChange={e => handleDownPaymentChange(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Down Payment ({((downPayment / convertedPropertyPrice) * 100).toFixed(0)}%)</Label>
                            <Slider value={[downPayment]} onValueChange={([val]) => handleDownPaymentChange(val)} max={convertedPropertyPrice} step={1000} className="[&>span:first-child>span]:bg-accent [&>span:last-child>span]:bg-accent [&>[role=slider]]:bg-accent" />
                        </div>
                         <div className="space-y-2">
                                <Label htmlFor="loan-amount">Loan Amount</Label>
                                <Input id="loan-amount" value={formatPrice(loanAmount, false)} onChange={e => handleLoanAmountChange(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                            </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                                <Input id="interest-rate" type="number" value={interestRate} onChange={e => setInterestRate(parseFloat(e.target.value))} step="0.1" />
                                <Button variant="link" size="sm" className="p-0 h-auto text-accent" onClick={handleGetSuggestion} disabled={isSuggesting}>
                                {isSuggesting ? 'Getting suggestion...' : 'Get Suggested Rate'}
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
                    </CardFooter>
                </div>

                <div className="flex flex-col items-center justify-center p-6">
                    {monthlyPayment ? (
                        <div className="w-full text-center space-y-4">
                            <div>
                                <p className="text-muted-foreground">Estimated Monthly Payment</p>
                                <p className="text-4xl font-bold font-headline text-accent">{formatPrice(parseFloat(monthlyPayment))}</p>
                            </div>
                             <div className="w-full h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number) => formatPrice(value)}
                                            contentStyle={{
                                                background: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: 'var(--radius)',
                                            }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <p>Enter your details to see the payment breakdown.</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
