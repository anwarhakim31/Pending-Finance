import HeaderLayout from "@/components/layouts/HeaderLayout";
import NavLayout from "@/components/layouts/NavLayout";
import ProfileMainView from "@/components/views/profile/ProfileMainView";

const ProfilePage = () => {
  return (
    <>
      <HeaderLayout />
      <ProfileMainView />
      <NavLayout />
    </>
  );
};

export default ProfilePage;
