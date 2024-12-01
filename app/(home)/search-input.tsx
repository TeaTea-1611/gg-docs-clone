"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParam } from "@/hooks/use-search-param";
import { SearchIcon, XIcon } from "lucide-react";
import React, { useRef, useState } from "react";

export const SearchInput = () => {
  const [search, setSearch] = useSearchParam();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(value);
    inputRef.current?.blur();
  };

  return (
    <div className="flex items-center justify-center flex-1">
      <form className="relative max-w-[720px] w-full" onSubmit={handleSubmit}>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          className="w-full h-12 border-none rounded-full outline-none px-14 focus-visible:shadow-md focus-visible:ring-0 bg-accent focus:bg-background"
        />
        <Button
          type="submit"
          variant={"ghost"}
          size={"icon"}
          className="absolute -translate-y-1/2 rounded-full left-3 top-1/2"
        >
          <SearchIcon className="size-4" />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute -translate-y-1/2 rounded-full right-3 top-1/2"
            onClick={() => {
              setValue("");
              setSearch("");
              inputRef.current?.blur();
            }}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </form>
    </div>
  );
};
