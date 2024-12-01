"use client";

import { BsCloudCheck } from "react-icons/bs";

export const DocInput = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg px-1.5">Untitled Document</span>
      <BsCloudCheck />
    </div>
  );
};
