'use client'

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

interface ReadMoreProps {
  text: string;
  linesToShow?: number;
}

export function ReadMore({ text, linesToShow = 4 }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [element, setElement] = useState<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (element) {
      // Check if the text is overflowing
      // The content is overflowing if its scroll height is greater than its client height
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * linesToShow;
      setIsOverflowing(element.scrollHeight > maxHeight);
    }
  }, [element, text, linesToShow]);


  return (
    <div className="relative">
      <p
        ref={setElement}
        className={cn(
            "text-muted-foreground leading-relaxed text-balance transition-all duration-300", 
            !isExpanded && `overflow-hidden`,
        )}
        style={{
            maxHeight: isExpanded ? `${element?.scrollHeight}px` : `${parseFloat(getComputedStyle(element || document.body).lineHeight) * linesToShow}px`,
            WebkitMaskImage: !isExpanded && isOverflowing ? 'linear-gradient(to bottom, black 50%, transparent 100%)' : 'none',
            maskImage: !isExpanded && isOverflowing ? 'linear-gradient(to bottom, black 50%, transparent 100%)' : 'none',
        }}
      >
        {text}
      </p>
      {isOverflowing && (
        <Button
          variant="link"
          className="text-accent p-0 h-auto mt-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </div>
  )
}
