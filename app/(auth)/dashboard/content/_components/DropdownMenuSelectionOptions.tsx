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
  onComponentSelect: (componentName: string) => void;
  isowner: any;
}


export function DropdownMenuSelectionOptions({ onComponentSelect, isowner }: DropdownMenuSelectionProps) {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null)
  console.log(isowner);

  const handleSelect = (componentName: string) => {

    onComponentSelect(componentName)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isowner && (
          <DropdownMenuItem onSelect={() => handleSelect("delete")}>
            Delete
          </DropdownMenuItem>
        )
        }

        {!isowner && (
          <DropdownMenuItem onSelect={() => handleSelect("delete")}>
            Remove
          </DropdownMenuItem>
        )
        }


        {!isowner && (
          <DropdownMenuItem onSelect={() => handleSelect("add-to-favorite")}>
            Add To Favorite
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}