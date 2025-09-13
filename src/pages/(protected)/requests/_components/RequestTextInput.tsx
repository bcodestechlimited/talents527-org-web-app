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
};

export const RequestTextInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isDisabled,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-1">
          <FormLabel className="text-slate-500">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type="text"
                disabled={isDisabled}
                className="h-10 px-4 rounded-full"
                placeholder={placeholder}
              />
            </div>
          </FormControl>
          <FormMessage className="mt-1" />
        </FormItem>
      )}
    />
  );
};
