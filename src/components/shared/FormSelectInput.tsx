import type { FieldValues, Control, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  options: { label: string; value: string }[];
  onValueChange?: (value: string) => void;
};

export const FormSelectInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  isDisabled,
  onValueChange,
}: Props<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="gap-1">
        <FormLabel className="font-normal">{label}</FormLabel>
        <FormControl>
          <Select
            disabled={isDisabled}
            onValueChange={(value) => {
              field.onChange(value);
              if (onValueChange) {
                onValueChange(value);
              }
            }}
            value={field.value || ""}
          >
            <SelectTrigger size="md" className="w-full px-4 text-sm">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="px-4 text-sm"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage className="mt-1" />
      </FormItem>
    )}
  />
);
