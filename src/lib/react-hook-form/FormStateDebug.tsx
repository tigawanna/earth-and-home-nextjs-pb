import { UseFormReturn } from "react-hook-form";

interface FormStateDebugProps {
  form: UseFormReturn<any>;
  title?: string;
  className?: string;
  showFullState?: boolean; // Option to show full form state or just errors
}

export function FormStateDebug({
  form,
  title = "🔧 Form State (Development)",
  className = "",
  showFullState = false
}: FormStateDebugProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const debugData = showFullState ? form.formState : form.formState.errors;

  return (
    <details className={`mt-6 p-4 bg-muted rounded-xl border border-border ${className}`}>
      <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        {title}
      </summary>
      <pre className="mt-3 text-xs overflow-auto text-muted-foreground bg-card p-3 rounded border">
        {JSON.stringify(debugData, null, 2)}
      </pre>
    </details>
  );
}
