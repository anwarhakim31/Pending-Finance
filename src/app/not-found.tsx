"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NotfoundPage = () => {
  return (
    <section className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-8xl font-black bg-clip-text bg-gradient-to-r from-violet-700 to-orange-500 text-transparent">
          404
        </h1>
        <p className="text-sm  my-2 text-muted-foreground">
          Halaman Tidak Ditemukan.
        </p>
        <Button className={"w-max py-2 mt-4 px-4"}>
          <Link href={"/dashboard"}>Dashboard</Link>
        </Button>
      </div>
    </section>
  );
};

export default NotfoundPage;
