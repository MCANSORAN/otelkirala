import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hasLocale, getDictionary } from "@/messages/dictionaries";
import { localeAlternates } from "@/utils/seo";
import { getCurrentUser } from "@/services/customerAuth.service";
import Header from "@/features/home/components/Header";
import Footer from "@/features/home/components/Footer";
import RegisterForm from "@/features/auth/components/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: `${dict.auth.register.title} | OtelKirala`,
    alternates: localeAlternates(lang, "/register"),
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (user) redirect(`/${lang}`);

  const dict = getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict.header} user={null} />
      <main className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{dict.auth.register.title}</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{dict.auth.register.subtitle}</p>
        <div className="mt-6">
          <RegisterForm lang={lang} dict={dict.auth.register} />
        </div>
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
