import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { BonRetour } from "../../models/bonRetourTypes";


const useBonRetour = () => {
     const [bonRetours, setBonRetours] = useState<BonRetour[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
  const fetchBonRetours = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bon de retour.");

      const data: BonRetour[] = await response.json();
      setBonRetours(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonRetours();
  }, []);
  return { bonRetours,loading,error,fetchBonRetours}
}

export default useBonRetour;