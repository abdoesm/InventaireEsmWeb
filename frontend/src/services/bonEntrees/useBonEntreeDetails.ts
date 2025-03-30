import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { BonEntree } from "../../models/BonEntreeTypes";


const useBonEntreeDetails = (id: string) => {
     
      
    const [bonEntree, setBonEntree] = useState<BonEntree | null>(null);
    const [mapEntrees, setMapEntrees] = useState<{ id: number; id_article: number; id_be: number; quantity: number; unit_price: number; }[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

   

const fetchData = async () => {
    try {
      const [bonEntreeRes, entreesRes] = await Promise.all([
        fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`),
        fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${id}`)
      ]);

      if (!bonEntreeRes.ok || !entreesRes.ok) {
        throw new Error("Failed to fetch data.");
      }

      const bonEntreeData = await bonEntreeRes.json();
      const entreesData = await entreesRes.json();

      setBonEntree(bonEntreeData);
      setMapEntrees(entreesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    
  
    fetchData();
  }, [fetchData, id]);
  return { bonEntree, mapEntrees, loading, error };

}
export default useBonEntreeDetails;