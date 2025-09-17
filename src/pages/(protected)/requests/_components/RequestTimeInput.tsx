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
  showSeconds?: boolean;
  disabled?: boolean;
};

export const RequestTimeInput = <T extends FieldValues>({
  control,
  name,
  label,
  showSeconds = true,
  disabled,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const [timeValue = "", period = "AM"] = field.value?.split(" ") ?? [
          "",
          "AM",
        ];

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(`${e.target.value} ${period}`);
        };

        return (
          <FormItem className="gap-1">
            <FormLabel className="text-slate-500">{label}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  step={showSeconds ? "1" : "60"}
                  value={timeValue}
                  onChange={handleTimeChange}
                  disabled={disabled}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none h-10 px-4 rounded-full"
                />
              </div>
            </FormControl>
            <FormMessage className="mt-1" />
          </FormItem>
        );
      }}
    />
  );
};
