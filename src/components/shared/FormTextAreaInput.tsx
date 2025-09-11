import type { FieldValues } from "react-hook-form";
import type { Control, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

export const FormTextAreaInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = true,
  rows = 4,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-0">
          <FormLabel className="flex items-center gap-0">
            <span>{label}</span>
            <span
              className={`text-base ${
                required ? "text-rose-400" : "text-white"
              }`}
            >
              &#42;{" "}
            </span>
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              className="px-4 text-lg rounded min-h-[100px]"
              placeholder={placeholder}
              rows={rows}
            />
          </FormControl>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
};
