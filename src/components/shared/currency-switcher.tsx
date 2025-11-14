'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const currencies = [
  { value: 'usd', label: 'USD' },
  { value: 'aed', label: 'AED' },
  { value: 'eur', label: 'EUR' },
  { value: 'gbp', label: 'GBP' },
];

export function CurrencySwitcher() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('usd');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between text-lg p-0 h-auto hover:bg-transparent hover:underline text-primary-foreground hover:text-primary-foreground"
        >
          {currencies.find((currency) => currency.value === value)?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] p-1 bg-primary text-primary-foreground border-muted-foreground/50">
        {currencies.map((currency) => (
          <div
            key={currency.value}
            onClick={() => {
              setValue(currency.value);
              setOpen(false);
            }}
            className={cn(
              'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent/20',
              value === currency.value && 'bg-accent/10'
            )}
          >
            {currency.label}
            <Check
              className={cn(
                'absolute right-2 h-4 w-4',
                value === currency.value ? 'opacity-100' : 'opacity-0'
              )}
            />
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
