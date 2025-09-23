"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const SearchableSelect = React.forwardRef(({ 
  className, 
  children, 
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  onValueChange,
  value,
  disabled = false,
  loading = false,
  ...props 
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [isSearching, setIsSearching] = React.useState(false)

  // Debounce search to improve performance
  React.useEffect(() => {
    if (searchValue) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        setIsSearching(false)
      }, 150)
      return () => clearTimeout(timer)
    } else {
      setIsSearching(false)
    }
  }, [searchValue])

  const handleSelect = (selectedValue) => {
    onValueChange?.(selectedValue === value ? "" : selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  const selectedOption = React.Children.toArray(children).find(
    (child) => child.props.value === value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 sm:h-11 text-left font-normal text-base sm:text-sm",
            !selectedOption && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          <span className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {selectedOption ? selectedOption.props.children : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" sideOffset={4}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-10 sm:h-9 text-base sm:text-sm"
          />
          <CommandList className="max-h-[250px] sm:max-h-[200px]">
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {React.Children.map(children, (child) => {
                    if (!child) return null
                    
                    const optionText = child.props.children?.toLowerCase() || ""
                    const matchesSearch = searchValue === "" || 
                      optionText.includes(searchValue.toLowerCase())
                    
                    if (!matchesSearch) return null
                    
                    return (
                      <CommandItem
                        key={child.props.value}
                        value={child.props.value}
                        onSelect={() => handleSelect(child.props.value)}
                        className="cursor-pointer hover:bg-accent/50 transition-colors py-3 sm:py-1.5 text-base sm:text-sm min-h-[48px] sm:min-h-[36px] flex items-center"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === child.props.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {child.props.children}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})

SearchableSelect.displayName = "SearchableSelect"

const SearchableSelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("hidden", className)}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  )
})

SearchableSelectItem.displayName = "SearchableSelectItem"

export { SearchableSelect, SearchableSelectItem }
