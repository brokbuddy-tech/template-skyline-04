'use client';

import { useCountUp } from '@/hooks/use-count-up';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
}

export function CountUp({ end, duration = 2, decimals = 0 }: CountUpProps) {
  const { count, ref } = useCountUp(end, duration, decimals);
  return <span ref={ref}>{count}</span>;
}
