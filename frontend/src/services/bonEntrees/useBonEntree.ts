import { useEffect, useState } from 'react'
import { Bk_End_SRVR } from '../../configs/conf';
import { BonEntree } from '../../models/BonEntreeTypes';

export const useBonEntree = () => {
   const [bonEntrees, setBonEntrees] = useState<BonEntree[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
     const [error, setError] = useState<string | null>(null);
  const fetchBonEntrees = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch bon d'entrée.");

      const data: BonEntree[] = await response.json();
      setBonEntrees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonEntrees();
  }, []);
    
    return { bonEntrees, loading, error,fetchBonEntrees };
}

export default useBonEntree;