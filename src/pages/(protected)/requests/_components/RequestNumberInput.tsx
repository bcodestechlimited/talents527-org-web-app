import type { FieldValues } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
};

export const RequestNumberInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Enter number",
  isDisabled,
  min = 1,
  max,
  defaultValue = 1,
}: Props<T>) => {
  const handleInputChange = (field: FieldValues, value: string) => {
    if (isDisabled) return;

    if (value === "") {
      field.onChange("");
      return;
    }

    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue) return;

    const num = parseInt(numericValue, 10);

    if (isNaN(num)) return;

    let constrainedValue = num;
    if (min !== undefined) constrainedValue = Math.max(constrainedValue, min);
    if (max !== undefined) constrainedValue = Math.min(constrainedValue, max);

    field.onChange(constrainedValue);
  };

  const handleBlur = (field: FieldValues) => {
    if (
      field.value === "" ||
      field.value === null ||
      field.value === undefined
    ) {
      field.onChange(defaultValue);
    } else {
      const num = Number(field.value);
      if (isNaN(num)) {
        field.onChange(defaultValue);
      } else {
        let constrainedValue = num;
        if (min !== undefined)
          constrainedValue = Math.max(constrainedValue, min);
        if (max !== undefined)
          constrainedValue = Math.min(constrainedValue, max);
        field.onChange(constrainedValue);
      }
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1 w-full">
          <FormLabel className="text-slate-500">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isDisabled}
              className="h-10 px-4 rounded-full"
              placeholder={placeholder}
              value={field.value ?? defaultValue}
              onChange={(e) => handleInputChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
            />
          </FormControl>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
};
