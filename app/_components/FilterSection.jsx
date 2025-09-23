import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchableSelect, SearchableSelectItem } from "@/components/ui/searchable-select"
import { Bath, BedDouble, Car, Home } from 'lucide-react'
import { Value } from '@radix-ui/react-select'


function FilterSection({ setIndustryType, setCategoryType }) {
    return (
        <div className='p-4 md:p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Filter Results</h3>
            <div className='flex flex-col sm:flex-row gap-4'>
                <SearchableSelect 
                    onValueChange={(value) => value === 'All' ? setIndustryType(null) : setIndustryType(value)}
                    placeholder="Industry Type"
                    searchPlaceholder="Search industries..."
                    emptyText="No industries found."
                    className="w-full sm:w-[200px] border-border focus:border-primary bg-background hover:bg-muted/50 transition-colors"
                >
                    <SearchableSelectItem value="All">All Industries</SearchableSelectItem>
                    <SearchableSelectItem value="automobile">Automobile</SearchableSelectItem>
                    <SearchableSelectItem value="child-care">Child Care</SearchableSelectItem>
                    <SearchableSelectItem value="decoration">Decoration</SearchableSelectItem>
                    <SearchableSelectItem value="farming">Farming</SearchableSelectItem>
                    <SearchableSelectItem value="fitness">Fitness</SearchableSelectItem>
                    <SearchableSelectItem value="food">Food</SearchableSelectItem>
                    <SearchableSelectItem value="hair-services">Hair Services</SearchableSelectItem>
                    <SearchableSelectItem value="handicraft">Handicraft</SearchableSelectItem>
                    <SearchableSelectItem value="housekeeping">Housekeeping</SearchableSelectItem>
                    <SearchableSelectItem value="immigration">Immigration</SearchableSelectItem>
                    <SearchableSelectItem value="makeup-services">Makeup Services</SearchableSelectItem>
                    <SearchableSelectItem value="personal-care">Personal Care Services</SearchableSelectItem>
                    <SearchableSelectItem value="pet-services">Pet Services</SearchableSelectItem>
                    <SearchableSelectItem value="photography">Photography</SearchableSelectItem>
                    <SearchableSelectItem value="real-estate">Real Estate</SearchableSelectItem>
                    <SearchableSelectItem value="technology">Technology</SearchableSelectItem>
                    <SearchableSelectItem value="trades">Trades</SearchableSelectItem>
                    <SearchableSelectItem value="tutoring">Tutoring</SearchableSelectItem>
                    <SearchableSelectItem value="videography">Videography</SearchableSelectItem>
                    <SearchableSelectItem value="wedding">Wedding</SearchableSelectItem>
                </SearchableSelect>

                <SearchableSelect 
                    onValueChange={(value) => value === 'All' ? setCategoryType(null) : setCategoryType(value)}
                    placeholder="Category Type"
                    searchPlaceholder="Search categories..."
                    emptyText="No categories found."
                    className="w-full sm:w-[200px] border-border focus:border-primary bg-background hover:bg-muted/50 transition-colors"
                >
                    <SearchableSelectItem value="All">All Categories</SearchableSelectItem>
                    <SearchableSelectItem value="auto-repair">Auto Repair</SearchableSelectItem>
                    <SearchableSelectItem value="bridal-wear">Bridal Wear</SearchableSelectItem>
                    <SearchableSelectItem value="catering">Catering</SearchableSelectItem>
                    <SearchableSelectItem value="custom-cakes">Custom Cakes</SearchableSelectItem>
                    <SearchableSelectItem value="custom-cookies">Custom Cookies</SearchableSelectItem>
                    <SearchableSelectItem value="custom-food">Custom Food / Delicacy</SearchableSelectItem>
                    <SearchableSelectItem value="dog-sitter">Dog Sitter</SearchableSelectItem>
                    <SearchableSelectItem value="electrician">Electrician</SearchableSelectItem>
                    <SearchableSelectItem value="eyebrows">Eyebrows</SearchableSelectItem>
                    <SearchableSelectItem value="facials">Facials</SearchableSelectItem>
                    <SearchableSelectItem value="family-photos">Family Photography</SearchableSelectItem>
                    <SearchableSelectItem value="decoration">Flowers & Decoration</SearchableSelectItem>
                    <SearchableSelectItem value="hair-dresser">Hair Dresser</SearchableSelectItem>
                    <SearchableSelectItem value="home-cook">Home Cook</SearchableSelectItem>
                    <SearchableSelectItem value="house-cleaner">House Cleaner</SearchableSelectItem>
                    <SearchableSelectItem value="lashes">Lashes</SearchableSelectItem>
                    <SearchableSelectItem value="lifestyle-photos">Lifestyle Photography</SearchableSelectItem>
                    <SearchableSelectItem value="mehndi">Mehndi</SearchableSelectItem>
                    <SearchableSelectItem value="misc">Misc</SearchableSelectItem>
                    <SearchableSelectItem value="music">Music</SearchableSelectItem>
                    <SearchableSelectItem value="nails">Nails</SearchableSelectItem>
                    <SearchableSelectItem value="nutrition">Nutrition</SearchableSelectItem>
                    <SearchableSelectItem value="other">Other</SearchableSelectItem>
                    <SearchableSelectItem value="personal-trainer">Personal Trainer</SearchableSelectItem>
                    <SearchableSelectItem value="pet-groomer">Pet Groomer</SearchableSelectItem>
                    <SearchableSelectItem value="plumber">Plumber</SearchableSelectItem>
                    <SearchableSelectItem value="restaurant">Restaurant</SearchableSelectItem>
                    <SearchableSelectItem value="web-development">Web Development</SearchableSelectItem>
                    <SearchableSelectItem value="wedding-sweets">Wedding Cakes & Sweets</SearchableSelectItem>
                    <SearchableSelectItem value="wedding-makeup-hair">Wedding Hair & Makeup</SearchableSelectItem>
                    <SearchableSelectItem value="wedding-photos-videos">Wedding Photos / Videos</SearchableSelectItem>
                    <SearchableSelectItem value="wedding-planner">Wedding Planner</SearchableSelectItem>
                    <SearchableSelectItem value="wedding-wear">Wedding Wear</SearchableSelectItem>
                </SearchableSelect>
            </div>
        </div>
    )
}

export default FilterSection