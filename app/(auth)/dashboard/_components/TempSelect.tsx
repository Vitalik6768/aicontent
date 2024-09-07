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

interface SelectionProps {
  onComponentSelect: (componentName: string) => void;
}

export function TempSelect({ onComponentSelect }: SelectionProps) {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const handleSelect = (componentName: string) => {
    onComponentSelect(componentName);
    // setSelectedComponent(componentName);
  };

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Templates" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Display Templates</SelectLabel>
          <SelectItem value="my">My</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}