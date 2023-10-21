"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CaretLeftIcon } from "@radix-ui/react-icons";

function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <Button variant={"secondary"} size={"sm"} onClick={handleBack}>
      <CaretLeftIcon width={24} height={24} />
    </Button>
  );
}

export default BackButton;
