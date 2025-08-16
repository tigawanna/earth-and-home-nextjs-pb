// Example usage of the reusable React Hook Form components

import { FormErrorDisplay, FormStateDebug } from "@/lib/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Example schema
const exampleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  age: z.number().min(18, "Must be at least 18 years old"),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

export function ExampleForm() {
  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 0,
    },
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Your form fields here */}
      
      {/* Submit button */}
      <button type="submit">Submit</button>

      {/* Enhanced Error Display - Just pass the form! */}
      <FormErrorDisplay 
        form={form}
        title="Please fix the following errors:"
        maxErrors={5}
        className="my-custom-class"
      />

      {/* Development Debug Info - Just pass the form! */}
      <FormStateDebug 
        form={form}
        title="🔧 Debug Form Errors"
        showFullState={false} // false = errors only, true = full form state
      />
    </form>
  );
}

/* 
✨ SIMPLIFIED API - Now you only need to pass the form instance!

1. FormErrorDisplay:
   - Automatically extracts error messages from form.formState.errors
   - Automatically checks if form has errors AND was submitted
   - Still configurable with title, maxErrors, and className

2. FormStateDebug:
   - Automatically shows form.formState.errors by default
   - Set showFullState={true} to see the entire form state
   - Only shows in development mode

BEFORE (manual):
const errorMessages = extractErrorMessages(form.formState.errors);
const hasErrors = hasFormErrors(form.formState);
<FormErrorDisplay errorMessages={errorMessages} isVisible={hasErrors} />

AFTER (automatic):
<FormErrorDisplay form={form} />

Much cleaner! 🚀
*/
