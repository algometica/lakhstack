import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Bath, BedDouble, Car, Home } from 'lucide-react'
import { Value } from '@radix-ui/react-select'


function FilterSection({ setIndustryType, setCategoryType }) {
    return (
        <div className='p-4 md:p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-4'>Filter Results</h3>
            <div className='flex flex-col sm:flex-row gap-4'>
                <Select onValueChange={(value) => value == 'All' ? setIndustryType(null) : setIndustryType(value)}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-border focus:border-primary bg-background hover:bg-muted/50 transition-colors">
                        <SelectValue placeholder="Industry Type" />
                    </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="farming">Farming</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="handicraft">Handicraft</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="immigration">Immigration</SelectItem>
                    <SelectItem value="personal-care">Personal Care Services</SelectItem>
                    <SelectItem value="pets">Pets</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="trades">Trades</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                </SelectContent>
            </Select>

                <Select onValueChange={(value) => value == 'All' ? setCategoryType(null) : setCategoryType(value)}>
                    <SelectTrigger className="w-full sm:w-[180px] h-11 border-border focus:border-primary bg-background hover:bg-muted/50 transition-colors">
                        <SelectValue placeholder="Category Type" />
                    </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="auto-repair">Auto Repair</SelectItem>
                    <SelectItem value="bridal-wear">Bridal Wear</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="custom-cakes">Custom Cakes</SelectItem>
                    <SelectItem value="custom-cookies">Custom Cookies</SelectItem>
                    <SelectItem value="custom-food">Custom Food / Delicacy</SelectItem>
                    <SelectItem value="dog-sitter">Dog Sitter</SelectItem>
                    <SelectItem value="electrician">Electrician</SelectItem>
                    <SelectItem value="eyebrows">Eyebrows</SelectItem>
                    <SelectItem value="facials">Facials</SelectItem>
                    <SelectItem value="family-photos">Family Photography</SelectItem>
                    <SelectItem value="decoration">Flowers & Decoration</SelectItem>
                    <SelectItem value="hair-dresser">Hair Dresser</SelectItem>
                    <SelectItem value="home-cook">Home Cook</SelectItem>
                    <SelectItem value="house-cleaner">House Cleaner</SelectItem>
                    <SelectItem value="lashes">Lashes</SelectItem>
                    <SelectItem value="lifestyle-photos">Lifestyle Photography</SelectItem>
                    <SelectItem value="mehndi">Mehndi</SelectItem>
                    <SelectItem value="misc">Misc</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="nails">Nails</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="personal-trainer">Personal Trainer</SelectItem>
                    <SelectItem value="pet-groomer">Pet Groomer</SelectItem>
                    <SelectItem value="plumber">Plumber</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="wedding-sweets">Wedding Cakes & Sweets</SelectItem>
                    <SelectItem value="wedding-makeup-hair">Wedding Hair & Makeup</SelectItem>
                    <SelectItem value="wedding-photos-videos">Wedding Photos / Videos</SelectItem>
                    <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                    <SelectItem value="wedding-wear">Wedding Wear</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
    )
}

export default FilterSection