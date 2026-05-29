'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitLead } from '@/lib/actions/lead.action';
import { leadSchema, type LeadFormValues } from '@/lib/validations/lead.schema';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface LeadFormProps {
  locale?: "en" | "ja";
}

const labelCls =
  "block text-[0.9rem] font-semibold text-jn-text-dark mb-2 font-[family-name:var(--font-poppins)]";

/** Base input class — append errCls when the field is invalid */
const baseCls =
  "jn-input transition-all";
const errCls =
  "!border-red-400 focus:!border-red-400 focus:!ring-red-100";

export function LeadForm({ locale = "en" }: LeadFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { t } = useTranslation(locale);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",           // validate field when user leaves it
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: LeadFormValues) {
    setServerError(null);
    const result = await submitLead(values);
    if (result.success) {
      setIsSuccess(true);
      form.reset();
    } else {
      setServerError(
        typeof result.error === 'string'
          ? result.error
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h4 className="text-xl font-semibold font-[family-name:var(--font-poppins)] text-jn-text-dark mb-2">
          {t("form.successTitle")}
        </h4>
        <p className="text-jn-text-muted mb-6">{t("form.success")}</p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="jn-btn jn-btn-outline"
        >
          {t("form.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        {/* Server error banner */}
        {serverError && (
          <div role="alert" className="p-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded-xl">
            {serverError}
          </div>
        )}

        {/* Row 1: Full Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <label htmlFor="lead-name" className={labelCls}>{t("form.fullName")}</label>
              <FormControl>
                <input
                  id="lead-name"
                  type="text"
                  placeholder={t("form.fullNamePlaceholder")}
                  className={`${baseCls} ${fieldState.invalid ? errCls : ""}`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 mt-1.5" />
            </FormItem>
          )}
        />

        {/* Row 2: Phone + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <label htmlFor="lead-phone" className={labelCls}>{t("form.phone")}</label>
                <FormControl>
                  <input
                    id="lead-phone"
                    type="tel"
                    placeholder={t("form.phonePlaceholder")}
                    className={`${baseCls} ${fieldState.invalid ? errCls : ""}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1.5" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <label htmlFor="lead-email" className={labelCls}>{t("form.email")}</label>
                <FormControl>
                  <input
                    id="lead-email"
                    type="email"
                    placeholder={t("form.emailPlaceholder")}
                    className={`${baseCls} ${fieldState.invalid ? errCls : ""}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500 mt-1.5" />
              </FormItem>
            )}
          />
        </div>

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field, fieldState }) => (
            <FormItem>
              <label htmlFor="lead-message" className={labelCls}>{t("form.message")}</label>
              <FormControl>
                <textarea
                  id="lead-message"
                  placeholder={t("form.messagePlaceholder")}
                  rows={4}
                  className={`${baseCls} resize-none ${fieldState.invalid ? errCls : ""}`}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500 mt-1.5" />
            </FormItem>
          )}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="jn-btn jn-btn-primary w-full py-4 text-[1.05rem] mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {form.formState.isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("form.submitting")}
            </span>
          ) : (
            t("form.submit")
          )}
        </button>

        <p className="text-center text-[0.8rem] text-jn-text-muted">
          By submitting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </Form>
  );
}
