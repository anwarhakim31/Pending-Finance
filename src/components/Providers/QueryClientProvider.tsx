"use client";
import React from "react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProv,
} from "@tanstack/react-query";

const clientQuery = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProv client={clientQuery}>{children}</QueryClientProv>;
};

export default QueryClientProvider;
