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
        <div className='px-3 py-2 grid grid-cols-2 md:flex gap-2'>
            <Select onValueChange={(value) => value == 'All' ? setIndustryType(null) : setIndustryType(value)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Industry Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="personal-care">Personal Care Services</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="pets">Pets</SelectItem>
                    <SelectItem value="housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="handicraft">Handicraft</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="trades">Trades</SelectItem>
                    <SelectItem value="immigration">Immigration</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => value == 'All' ? setCategoryType(null) : setCategoryType(value)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="bridal-wear">Bridal Wear</SelectItem>
                    <SelectItem value="wedding-wear">Wedding Wear</SelectItem>
                    <SelectItem value="wedding-makeup-hair">Wedding Hair & Makeup</SelectItem>
                    <SelectItem value="wedding-photos-videos">Wedding Photos / Videos</SelectItem>
                    <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                    <SelectItem value="wedding-sweets">Wedding Cakes & Sweets</SelectItem>
                    <SelectItem value="mehndi">Mehndi</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="decoration">Flowers & Decoration</SelectItem>

                    <SelectItem value="personal-trainer">Personal Trainer</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>

                    <SelectItem value="facials">Facials</SelectItem>
                    <SelectItem value="eyebrows">Eyebrows</SelectItem>
                    <SelectItem value="lashes">Lashes</SelectItem>
                    <SelectItem value="nails">Nails</SelectItem>
                    <SelectItem value="hair-dresser">Hair Dresser</SelectItem>
                    
                    <SelectItem value="restaurant">Restaurant</SelectItem>

                    <SelectItem value="custom-cookies">Custom Cookies</SelectItem>
                    <SelectItem value="custom-cakes">Custom Cakes</SelectItem>
                    <SelectItem value="custom-food">Custom Food / Delicacy</SelectItem>

                    <SelectItem value="family-photos">Family Photography</SelectItem>
                    <SelectItem value="lifestyle-photos">Lifestyle Photography</SelectItem>

                    <SelectItem value="misc">Misc</SelectItem>
                    
                    <SelectItem value="music">Music</SelectItem>

                    <SelectItem value="dog-sitter">Dog Sitter</SelectItem>
                    <SelectItem value="pet-groomer">Pet Groomer</SelectItem>

                    <SelectItem value="house-cleaner">House Cleaner</SelectItem>
                    <SelectItem value="home-cook">Home Cook</SelectItem>

                    <SelectItem value="web-development">Web Development</SelectItem>

                    <SelectItem value="electrician">Electrician</SelectItem>
                    <SelectItem value="plumber">Plumber</SelectItem>
                    <SelectItem value="auto-repair">Auto Repair</SelectItem>

                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default FilterSection