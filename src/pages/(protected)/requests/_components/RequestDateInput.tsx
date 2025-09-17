import type { FieldValues, Control, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
};

export const RequestDateInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isDisabled = false,
}: Props<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="gap-1">
        <FormLabel className="text-slate-500">{label}</FormLabel>
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={isDisabled}
                className={`h-10 w-full px-4 rounded-full justify-start text-left ${
                  !field.value && "text-muted-foreground"
                } ${isDisabled && "opacity-50 cursor-not-allowed"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date <= today;
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </FormControl>
        <FormMessage className="mt-1" />
      </FormItem>
    )}
  />
);
