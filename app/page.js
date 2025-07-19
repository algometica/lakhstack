import { Button } from "@/components/ui/button";
import Hero from './_components/Hero'
import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";

export default function Home() {
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <Hero />
      </div>
      <div>
        <ListingMapView featured={[true]} />
      </div>
    </div>
  );
}