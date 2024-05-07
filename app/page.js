import { Button } from "@/components/ui/button";
import Hero from './_components/Hero'
import Image from "next/image";
import ListingMapView from "./_components/ListingMapView";

export default function Home() {
  return (
    <div>
      <div className="px-10 p-10">
        <Hero />
      </div>
      <div className="px-10 p-10">
        <ListingMapView featured={[true]} />
      </div>
    </div>

  );
}