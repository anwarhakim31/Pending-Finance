"use client";
import { signOut } from "next-auth/react";
import React from "react";

const ProfilePage = () => {
  return <div onClick={() => signOut({ callbackUrl: "/login" })}>Logout</div>;
};

export default ProfilePage;
