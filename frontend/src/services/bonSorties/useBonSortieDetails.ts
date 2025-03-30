import { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { BonSortie } from "../../models/bonSortieType";

const useBonSortieDetails = (id: number) => {
      const [bonSortie, setBonSortie] = useState<BonSortie | null>(null);
      const [mapSorties, setMapSorties] = useState<{ id: number; id_article: number; id_bs: number; quantity: number }[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bonSortieRes, sortiesRes] = await Promise.all([
          fetch(`${Bk_End_SRVR}:5000/api/bonsorties/${id}`),
          fetch(`${Bk_End_SRVR}:5000/api/bonsorties/sortie/${id}`),
        ]);

        if (!bonSortieRes.ok) throw new Error("Failed to fetch Bon de Sortie details");
        if (!sortiesRes.ok) throw new Error("Failed to fetch sorties");

        setBonSortie(await bonSortieRes.json());
        setMapSorties(await sortiesRes.json());
      } catch (err) {
      
          setError((err as Error).message);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id]);
  return { bonSortie, mapSorties, loading, error };
}
export default useBonSortieDetails;