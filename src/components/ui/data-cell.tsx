import React, { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

function DataCell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className=" text-sm flex gap-2 py-4">
        <span className="flex-grow text-neutral-400">{title}</span>
        {children}
      </div>
      <Separator />
    </>
  );
}

export default DataCell;
