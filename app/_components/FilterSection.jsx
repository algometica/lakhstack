import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CATEGORY_OPTIONS } from "@/lib/category-taxonomy"

function FilterSection({ setCategoryType, categoryType, compact = false }) {
    return (
        <div className={compact ? 'p-0' : 'p-4 md:p-6'}>
            {!compact && (
                <div className='flex flex-col gap-2 mb-5'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>Filter</p>
                    <h3 className='text-lg md:text-xl font-semibold text-foreground'>Find vendors by category</h3>
                </div>
            )}
            <div className='flex flex-col sm:flex-row gap-4'>
                <Select
                    value={categoryType || 'All'}
                    onValueChange={(value) => value === 'All' ? setCategoryType(null) : setCategoryType(value)}
                >
                    <SelectTrigger className="w-full sm:w-[420px] h-12 bg-white/90 border border-black/10 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-w-[720px]">
                        <SelectItem value="All" className="py-2">All Categories</SelectItem>
                        {CATEGORY_OPTIONS.map((category) => (
                            <SelectItem
                                key={category.value}
                                value={category.value}
                                textValue={category.label}
                                className="items-start py-2.5"
                            >
                                <span className="font-medium text-foreground">{category.label}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default FilterSection
