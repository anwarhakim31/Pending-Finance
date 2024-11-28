"use client";
import React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface SessionProviderProps {
  session: Session | null;
  children: React.ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({
  session,
  children,
}) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
