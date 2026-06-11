'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { submitOrgInquiry } from '@/lib/api';

export type OrgInquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  listingId?: string;
  propertyType?: string;
  propertyInterest?: string;
  budget?: number;
  templateName?: string;
  formContext?: string;
};

type SubmitInquiryOptions = {
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong while submitting your request. Please try again.';
}

export function useOrgInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInquiry = async (
    payload: OrgInquiryPayload,
    options: SubmitInquiryOptions = {}
  ) => {
    setIsSubmitting(true);

    try {
      const response = await submitOrgInquiry({
        ...payload,
        phone: payload.phone?.trim() || undefined,
        listingId: payload.listingId || undefined,
        propertyType: payload.propertyType || undefined,
      });

      toast({
        title: options.successTitle || 'Request sent',
        description:
          options.successDescription || 'Our team will get back to you shortly.',
      });

      return { ok: true as const, response };
    } catch (error) {
      toast({
        variant: 'destructive',
        title: options.errorTitle || 'Unable to send request',
        description: getErrorMessage(error),
      });

      return { ok: false as const, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitInquiry,
  };
}
