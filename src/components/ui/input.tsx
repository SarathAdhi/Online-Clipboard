import * as React from "react";

import { cn } from "@utils/cn";
import { Label } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { name, id = name, className, containerClassName, type, label, ...props },
    ref
  ) => {
    return (
      <div className={cn("ui-container", containerClassName)}>
        {label && (
          <Label htmlFor={name}>
            {label} {props.required && <span className="text-red-500">*</span>}
          </Label>
        )}

        <input
          {...{ name, id }}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
