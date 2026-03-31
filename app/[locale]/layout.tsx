import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isValidLocale } from "../../lib/i18n";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return <>{children}</>;
}