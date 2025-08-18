"use client";

import { Control, FieldPath, useWatch } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChartNoAxesColumnDecreasing, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PropertyFormData } from "./property-form-schema";
import { FormFieldProps, createEnumOptions, formatCurrency, parseCurrency } from "@/utils/forms";

// Basic Text Input Field
export function TextFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
}: FormFieldProps<PropertyFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              className="bg-base-100/30"
              placeholder={placeholder}
              {...field}
              value={(field.value as string) || ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Textarea Field
export function TextareaFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
}: FormFieldProps<PropertyFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              value={(field.value as string) || ""}
              rows={4}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Number Input Field
export function NumberFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
}: FormFieldProps<PropertyFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              {...field}
              value={(field.value as number) || ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Currency Input Field
interface CurrencyFieldProps extends FormFieldProps<PropertyFormData> {
  currency?: string;
}

export function CurrencyFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  currency = "USD",
}: CurrencyFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative flex justify-center items-center gap-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                {currency}
              </span>
              <Input
                type="number"
                placeholder={placeholder}
                className="pl-16"
                {...field}
                value={(field.value as number) || ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Select Field
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends FormFieldProps<PropertyFormData> {
  options: SelectOption[];
}

export function SelectFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
  options,
}: SelectFieldProps) {
  const currentValue = useWatch({ control, name });
  //  console.log("Current value in SelectFieldComponent:== ", currentValue);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel
              className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
              {label}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value as string}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// Switch Field
export function SwitchFieldComponent({
  control,
  name,
  label,
  description,
}: Omit<FormFieldProps<PropertyFormData>, "placeholder" | "required">) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Multi-Select Tags Field
interface MultiSelectTagsProps extends Omit<FormFieldProps<PropertyFormData>, "placeholder"> {
  options: string[];
  placeholder?: string;
}

export function MultiSelectTagsComponent({
  control,
  name,
  label,
  description,
  options,
  placeholder = "Type to add...",
}: MultiSelectTagsProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2">
                {((field.value as string[]) || []).map((item, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = (field.value as string[]).filter((_, i) => i !== index);
                        field.onChange(newValue);
                      }}
                      className="ml-1 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Add New Tags */}
              <Select
                onValueChange={(value) => {
                  const currentValue = (field.value as string[]) || [];
                  if (!currentValue.includes(value)) {
                    field.onChange([...currentValue, value]);
                  }
                }}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .filter((option) => !((field.value as string[]) || []).includes(option))
                    .map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Multi-Select Field with Options
interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectFieldProps extends Omit<FormFieldProps<PropertyFormData>, "placeholder"> {
  options: MultiSelectOption[];
  placeholder?: string;
}

export function MultiSelectFieldComponent({
  control,
  name,
  label,
  description,
  options,
  placeholder = "Select options...",
}: MultiSelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {/* Selected Items */}
              <div className="flex flex-wrap gap-2">
                {((field.value as string[]) || []).map((item, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {options.find((opt) => opt.value === item)?.label || item}
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = (field.value as string[]).filter((_, i) => i !== index);
                        field.onChange(newValue);
                      }}
                      className="ml-1 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {/* Add New Items */}
              <Select
                onValueChange={(value) => {
                  const currentValue = (field.value as string[]) || [];
                  if (!currentValue.includes(value)) {
                    field.onChange([...currentValue, value]);
                  }
                }}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .filter((option) => !((field.value as string[]) || []).includes(option.value))
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Date Field
export function DateFieldComponent({
  control,
  name,
  label,
  placeholder,
  description,
  required = false,
}: FormFieldProps<PropertyFormData>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel
            className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}>
                  {field.value ? (
                    format(field.value as Date, "PPP")
                  ) : (
                    <span>{placeholder || "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value as Date}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
