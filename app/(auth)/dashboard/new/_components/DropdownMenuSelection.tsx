import { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react"


interface DropdownMenuSelectionProps {
  onComponentSelect: (componentName: string) => void
}


export function DropdownMenuSelection({ onComponentSelect }: DropdownMenuSelectionProps) {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null)

  const handleSelect = (componentName: string) => {

    onComponentSelect(componentName)
    // setSelectedComponent(componentName)
    // console.log(`${componentName} selected`)


    // Additional logic can be placed here if you need to do something with the selected component
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Add +</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleSelect("text")}>
          Text Input
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSelect("textarea")}>
          Text Area
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSelect("panel")}>
          Panel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}