// src/components/ui/Label.jsx
import React from "react";
import { cn } from "../../lib/utils";// Make sure this utility exists

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-white dark:text-slate-100", className)}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };
