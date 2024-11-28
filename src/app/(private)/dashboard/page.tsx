"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

const DashboardPage = () => {
  return (
    <Button
      variant="destructive"
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
    >
      Log out
    </Button>
  );
};

export default DashboardPage;
