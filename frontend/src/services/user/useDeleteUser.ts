import { useState } from "react";
import { Bk_End_SRVR } from "../../configs/conf";

const useDeleteUser = (fetchUsers: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: number) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${Bk_End_SRVR}:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete user");

      fetchUsers();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { deleteUser, loading, error };
};

export default useDeleteUser;