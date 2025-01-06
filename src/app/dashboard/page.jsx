"use client";
import React from "react";
import { DataCard } from "@/components/LandingPage/data-card";
import data from "@/utils/data.json"; // Import the local JSON file directly

const Page = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {data.cards.map((card, index) => (
          <DataCard key={index} value={card.value} name={card.name} />
        ))}
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
};

export default Page;
