import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { BonSortie } from "../../models/bonSortieType";


const useBonSortie = () => {
     const [bonSorties, setBonSorties] = useState<BonSortie[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string | null>(null);
   const fetchBonSorties = async () => {
     try {
       const token = localStorage.getItem("token");
       if (!token) {
         setError("No token found. Please log in.");
         setLoading(false);
         return;
       }
 
       const response = await fetch(`${Bk_End_SRVR}:5000/api/bonsorties`, {
         headers: { Authorization: `Bearer ${token}` },
       });
 
       if (!response.ok) throw new Error("Failed to fetch bon de sortie.");
 
       const data: BonSortie[] = await response.json();
       setBonSorties(data);
     } catch (err) {
       setError(err instanceof Error ? err.message : "An unknown error occurred.");
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    fetchBonSorties();
  }, []);
  return { bonSorties,loading,error,fetchBonSorties}
}

export default useBonSortie;