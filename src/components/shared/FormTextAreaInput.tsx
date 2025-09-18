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
  isDisabled?: boolean;
};

export const FormTextAreaInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isDisabled = false,
  rows = 4,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormControl>
            <Textarea
              disabled={isDisabled}
              {...field}
              className="px-4 text-lg rounded-lg min-h-[100px]"
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
