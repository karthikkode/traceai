import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownMenuProps {
  options: { option: string }[];
  label: string;
}

export function DropdownMenu({ options, label }: DropdownMenuProps) {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((item, index) => (
            <SelectItem value={item.option}>{item.option}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
