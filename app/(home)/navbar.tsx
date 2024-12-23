"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between size-full gap-x-2">
      <div className="flex items-center gap-3 pr-6 shrink-0">
        <Link href={"/"}>
          <Image src={"/logo.svg"} alt="logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl font-semibold">Docs</h3>
      </div>
      <SearchInput />
      <div className="flex items-center gap-x-2">
        <OrganizationSwitcher
          afterCreateOrganizationUrl="/"
          afterLeaveOrganizationUrl="/"
          afterSelectOrganizationUrl="/"
          afterSelectPersonalUrl="/"
        />
        <UserButton />
      </div>
    </nav>
  );
};
