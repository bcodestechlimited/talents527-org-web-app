import { useState, useRef, useEffect } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldValues } from "react-hook-form";
import type { Control, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  isDisabled?: boolean;
  length?: number;
};

export const FormOtpInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  isDisabled,
  length = 6,
}: Props<T>) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (
    element: HTMLInputElement,
    index: number,
    onChange: (value: string) => void
  ) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    const newValue = newOtp.join("");
    onChange(newValue);

    if (element.value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="gap-3">
          <FormLabel className="flex justify-center">{label}</FormLabel>
          <FormControl>
            <>
              <Input type="hidden" {...field} />

              <div className="flex space-x-2 justify-center">
                {otp.map((data, index) => (
                  <Input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={data}
                    ref={(el) => {
                      if (el) {
                        inputsRef.current[index] = el;
                      }
                    }}
                    onChange={(e) =>
                      handleChange(
                        e.target as HTMLInputElement,
                        index,
                        field.onChange
                      )
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    disabled={isDisabled}
                    className="w-12 h-12 text-center !text-xl"
                    placeholder={index === 0 ? placeholder : ""}
                  />
                ))}
              </div>
            </>
          </FormControl>
          <FormMessage className="font-cabinet mt-1 text-center" />
        </FormItem>
      )}
    />
  );
};
