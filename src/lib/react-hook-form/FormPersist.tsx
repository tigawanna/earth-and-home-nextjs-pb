import { ReactElement } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";

interface FormPersistProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  formKey: string;
}

export function FormPersist<T extends FieldValues>(props: FormPersistProps<T>): ReactElement {
  const { form, formKey } = props;
  // const { watch, setValue } = form;
  // const formData = watch();
  // console.log("FormPersist - title", formData.title);
  // console.log("FormPersist - type", formData.propertyType);
  useFormPersist(formKey, {
    watch: form.watch,
    setValue: form.setValue,
    // storage:window.sessionStorage,
  });
  return <></>;
}
