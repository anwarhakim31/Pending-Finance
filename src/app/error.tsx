"use client";

import { Button } from "@/components/ui/button";

const ErrorPage = ({ reset }: { reset: () => void }) => {
  return (
    <section className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-8xl font-black bg-clip-text bg-gradient-to-r from-violet-700 to-orange-500 text-transparent">
          500
        </h1>
        <p className="text-sm  my-2 text-muted-foreground">
          Sistem sedang mengalami gangguan.
        </p>
        <Button onClick={() => reset()} className={"w-max py-2 px-4"}>
          Coba lagi
        </Button>
      </div>
    </section>
  );
};

export default ErrorPage;
