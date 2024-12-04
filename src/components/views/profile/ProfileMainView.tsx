"use client";

import { KeyRound, LogOut, UserPen } from "lucide-react";
import { signOut } from "next-auth/react";

import React from "react";

import FormProfileView from "./FormProfileView";
import FormPasswordView from "./FormPasswordView";

const ProfileMainView = () => {
  const [isProfile, setIsProfile] = React.useState(false);
  const [isPassword, setIsPassword] = React.useState(false);

  const action = [
    {
      label: "Logout",
      icon: <LogOut size={16} />,
      color: "bg-red-500 hover:bg-red-600",
      name: "Keluar",
      onclick: () => signOut({ callbackUrl: "/login" }),
    },
    {
      label: "Ganti Profil",
      icon: <UserPen size={16} />,
      color: "bg-violet-500 hover:bg-violet-600",
      name: "Ganti Profil",
      onclick: () => setIsProfile(!isProfile),
    },
    {
      label: "Ganti Password",
      icon: <KeyRound size={16} />,
      color: "bg-green-500 hover:bg-green-600",
      name: "Ganti Password",
      onclick: () => setIsPassword(!isPassword),
    },
  ];

  return (
    <main>
      <section className="container pt-[4.5rem] pb-14 px-4 ">
        <div className="flex gap-2 sm:items-center justify-start sm:flex-row flex-col">
          {action.map((item, index) => (
            <button
              key={index}
              onClick={item.onclick}
              aria-label={item.label}
              className={`${item.color} rounded-md shadow-md py-2 px-4 w-max text-white hover:shadow-md transition-all duration-300 flex items-center gap-2 text-xs`}
            >
              {item.icon && item.icon} {item.name}
            </button>
          ))}
        </div>

        <FormProfileView
          isProfile={isProfile}
          setIsProfile={() => setIsProfile(!isProfile)}
        />
        {isPassword && (
          <FormPasswordView
            isPassword={isPassword}
            setIsPassword={() => setIsPassword(!isPassword)}
          />
        )}
      </section>
    </main>
  );
};

export default ProfileMainView;
