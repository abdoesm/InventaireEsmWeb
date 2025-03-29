import { useEffect, useState } from "react";
import { Fournisseur } from "../../models/fournisseurTypes";
import { Bk_End_SRVR } from "../../configs/conf";


const useFornisseurs = () => {
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  
      const [error, setError] = useState<string | null>(null);
        const fetchFournisseurs = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              setError("No token found. Please log in.");
              setLoading(false);
              return;
            }
      
            const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs`, {
              headers: { Authorization: `Bearer ${token}` },
            });
      
            if (!response.ok) throw new Error("Failed to fetch fournisseurs.");
      
            const data: Fournisseur[] = await response.json();
            setFournisseurs(data);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
          } finally {
            setLoading(false);
          }
        };
      
        useEffect(() => {
          fetchFournisseurs();
        }, []);
        return { fournisseurs, loading, error, fetchFournisseurs };
}

export default useFornisseurs;