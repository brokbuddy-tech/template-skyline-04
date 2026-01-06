
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  propertyName: string;
  faqs: FaqItem[];
}

export function FaqAccordion({ propertyName, faqs }: FaqAccordionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-12 md:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Frequently Asked Questions about {propertyName}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:bg-gray-100 dark:hover:bg-muted/50 px-4 py-4 rounded-t-lg transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-4 bg-white dark:bg-muted/30 rounded-b-lg">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
