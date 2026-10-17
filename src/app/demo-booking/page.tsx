"use client";

import React, { useState } from "react";
import { BookingForm } from "@/components/ui/form";

export default function BookingFormDemo() {
  const [destination, setDestination] = useState("Las Toninas, Calle 4 N° 1850");

  const handleDateRangeClick = () => {
    console.log("Date range selector clicked");
  };

  const handleRoomsClick = () => {
    console.log("Room selector clicked");
  };

  const handleGuestsClick = () => {
    console.log("Guest selector clicked");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-950 p-6">
      <div className="w-full max-w-md">
        <BookingForm
          initialGuests={4}
          onSearch={(data) => console.log("Search:", data)}
        />
      </div>
    </div>
  );
}
