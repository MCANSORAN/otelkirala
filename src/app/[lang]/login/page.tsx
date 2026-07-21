import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { localeAlternates, webPageJsonLd, organizationJsonLd, faqJsonLd } from "@/utils/seo";
import { getCurrentUser } from "@/services/customerAuth.service";
import JsonLd from "@/components/JsonLd";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import Faq from "@/features/home/components/Faq";
import LoginForm from "@/features/auth/components/LoginForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.auth.login.metaTitle,
    alternates: localeAlternates(lang, "/login"),
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (user) redirect(`/${lang}`);

  const dict = getDictionary(lang);

  const structuredData = [
    webPageJsonLd(lang, {
      title: dict.auth.login.metaTitle,
      description: dict.auth.login.subtitle,
      path: "/login",
    }),
    organizationJsonLd(lang),
    faqJsonLd(dict.auth.login.faq.items),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Header lang={lang} dict={dict.header} />
      <main>
        <section className="mx-auto max-w-md px-6 py-20">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{dict.auth.login.title}</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{dict.auth.login.subtitle}</p>
          <div className="mt-6">
            <LoginForm lang={lang} dict={dict.auth.login} />
          </div>
        </section>
        <Faq dict={dict.auth.login.faq} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
