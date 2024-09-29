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
import { Menu } from "lucide-react";


interface DropdownMenuSelectionProps {
  onComponentSelect: (componentName: string) => void;
  isowner: any;
}


export function DropdownMenuSelectionOptions({ onComponentSelect, isowner }: DropdownMenuSelectionProps) {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null)

  const handleSelect = (componentName: string) => {

    onComponentSelect(componentName)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Menu className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isowner && (
          <DropdownMenuItem onSelect={() => handleSelect("delete")}>
            Delete
          </DropdownMenuItem>
        )
        }

        {!isowner && (
          <DropdownMenuItem className="cursor-pointe" onSelect={() => handleSelect("delete")}>
            Remove
          </DropdownMenuItem>
        )
        }


        {!isowner && (
          <DropdownMenuItem className="cursor-pointe" onSelect={() => handleSelect("add-to-favorite")}>
            Add To Favorite
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}