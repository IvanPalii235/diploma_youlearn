import useAuthCheck from "@/hooks/useAuthCheck";

const Profile = () => {
  const { user } = useAuthCheck();

  if (!user) {
    return <p>Завантаження...</p>;
  }

  return (
    <div>
      <h1>
        {user.role === "TEACHER" ? "Профіль викладача" : "Профіль користувача"}
      </h1>
      <p>Ім'я: {user.firstName}</p>
      <p>Прізвище: {user.lastName}</p>
    </div>
  );
};

export default Profile;
