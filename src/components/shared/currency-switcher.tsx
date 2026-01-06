
'use client';

import { useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';
import { CurrencyContext, currencies } from '@/context/currency-context';
import { cn } from '@/lib/utils';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useContext(CurrencyContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm font-medium transition-colors hover:bg-transparent hover:text-accent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto mr-[20px]"
        >
          {currency.toUpperCase()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-[120px] bg-background border-[#EAEAEA] shadow-sm">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c.value}
            onSelect={() => setCurrency(c.value)}
            className="cursor-pointer hover:bg-accent/10"
          >
            {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
