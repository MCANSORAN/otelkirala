export default function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
      {message}
    </p>
  );
}
