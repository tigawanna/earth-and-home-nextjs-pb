import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { extractErrorMessages, hasFormErrors } from "./form-utils";

interface FormErrorDisplayProps {
  form: UseFormReturn<any>;
  title?: string;
  maxErrors?: number;
  className?: string;
}

export function FormErrorDisplay({
  form,
  title = "Please fix the following errors:",
  maxErrors = 5,
  className = ""
}: FormErrorDisplayProps) {
  const errorMessages = extractErrorMessages(form.formState.errors);
  const isVisible = hasFormErrors(form.formState);

  if (!isVisible || errorMessages.length === 0) {
    return null;
  }

  const displayedErrors = errorMessages.slice(0, maxErrors);
  const remainingCount = errorMessages.length - maxErrors;

  return (
    <div className={`mt-6 p-6 bg-destructive/10 border-2 border-destructive/20 rounded-xl ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
          <AlertCircle className="h-5 w-5 text-destructive" />
        </div>
        <div className="space-y-3 flex-1">
          <h4 className="font-semibold text-destructive text-lg">
            {title}
          </h4>
          <ul className="text-sm text-destructive/80 space-y-2">
            {displayedErrors.map((error, index) => (
              <li key={index} className="flex items-start gap-3 p-2 bg-destructive/5 rounded-lg">
                <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="text-destructive/70 italic text-center py-2">
                ... and {remainingCount} more errors
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
