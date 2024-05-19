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
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="trades">Trades</SelectItem>
                    <SelectItem value="clothing-retail">Clothing</SelectItem>
                    <SelectItem value="immigration">Immigration</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(value) => value == 'All' ? setCategoryType(null) : setCategoryType(value)}>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">
                        All
                    </SelectItem>
                    <SelectItem value="hair-makeup">Hair and Makeup</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="photography">Photography and Video</SelectItem>
                    <SelectItem value="decoration">Flowers and Decoration</SelectItem>
                    <SelectItem value="wedding-planner">Wedding Planner</SelectItem>
                    <SelectItem value="wedding-cakes">Wedding Cakes</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="mehndi">Mehndi</SelectItem>
                    <SelectItem value="personal-training">Personal Training</SelectItem>
                    <SelectItem value="web-development">Web App Development</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default FilterSection