
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CurrencyContext } from '@/context/currency-context';
import { Info } from 'lucide-react';
import { useContext, useMemo } from 'react';

interface UpfrontCostModalProps {
  annualRent: number;
}

const DEWA_DEPOSIT = 2130; // Fixed value for apartments
const EJARI_FEE = 220; // Fixed value

export function UpfrontCostModal({ annualRent }: UpfrontCostModalProps) {
  const { currency, formatPrice, convertFromUSD } = useContext(CurrencyContext);

  const costs = useMemo(() => {
    // Note: The prompt uses AED as the base for calculation examples.
    // We will use USD as the base from our data and convert everything to the currently selected currency.
    // The fixed values (DEWA, EJARI) are assumed to be based on AED market rates, so we convert them from AED to USD first, then to the target currency.
    const aedToUsdRate = 1 / 3.67;
    const dewaDepositUSD = DEWA_DEPOSIT * aedToUsdRate;
    const ejariFeeUSD = EJARI_FEE * aedToUsdRate;
    
    const agencyFee = annualRent * 0.05 * 1.05; // 5% + 5% VAT
    const securityDeposit = annualRent * 0.05;

    const totalUpfront = agencyFee + securityDeposit + dewaDepositUSD + ejariFeeUSD;

    return {
      annualRent,
      agencyFee,
      securityDeposit,
      dewaDeposit: dewaDepositUSD,
      ejariFee: ejariFeeUSD,
      totalUpfront,
    };
  }, [annualRent]);

  const costItems = [
    { label: 'Annual rent', value: costs.annualRent },
    {
      label: 'Real estate agency fee',
      subtext: '(5% of the annual rent + 5% VAT)',
      value: costs.agencyFee,
    },
    { label: 'Security deposit', value: costs.securityDeposit },
    { label: 'DEWA deposit', value: costs.dewaDeposit },
    { label: 'Ejari Fee', value: costs.ejariFee },
  ];

  return (
    <DialogContent className="sm:max-w-md bg-background text-foreground border-foreground/20">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl font-bold">
          Estimated payment breakdown
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-4">
        {costItems.map((item, index) => (
          <div key={index} className="flex justify-between items-start">
            <div>
              <p className="text-sm">{item.label}</p>
              {item.subtext && (
                <p className="text-xs text-muted-foreground">
                  {item.subtext}
                </p>
              )}
            </div>
            <p className="text-sm font-medium text-right shrink-0 ml-4">
              {formatPrice(item.value)}
            </p>
          </div>
        ))}
        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <p className="text-base font-bold">Total upfront costs</p>
          <p className="text-base font-bold text-right">
            {formatPrice(costs.totalUpfront)}
          </p>
        </div>
      </div>
      <div className="bg-muted p-4 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          In addition to the upfront costs, prospective renters should note the
          total annual rent may increase when paying with multiple cheques
          throughout the year.
        </p>
      </div>
      <DialogFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
          Property Finder makes no warranties or representations about the
          accuracy of the information provided.
          <a href="#" className="underline ml-1">
            See full disclaimer
          </a>
        </p>
      </DialogFooter>
    </DialogContent>
  );
}
