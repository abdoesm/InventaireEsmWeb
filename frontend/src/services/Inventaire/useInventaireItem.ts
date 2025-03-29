import { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { InventaireItem } from "../../models/inventaireItemType";


 const useInventaireItems =() => {
    const [inventaireItems, setInventaireItems] = useState<InventaireItem[]>([]);
      const [error, setError] = useState<string | null>(null);
       const [loading, setLoading] = useState<boolean>(true);
       const fetchInventaireItems = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
          }
    
          const response = await fetch(`${Bk_End_SRVR}:5000/api/inventaire`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
      
          if (!response.ok) throw new Error("Failed to fetch inventaire item.");
    
          const data = await response.json();
          console.log("data", data);
          const mappedData = data.map((item: any) => ({
            id: item.id,
            idArticle: item.id_article,  // Corrected
            idUser: item.user_id,  // Corrected
            idLocalisation: item.id_localisation,  // Corrected
            idEmployer: item.id_employer,  // Corrected
            numInventaire: item.num_inventaire,  // Corrected
            dateInventaire: item.time,  // Corrected
            status: item.status, 
          }));
    
    
          setInventaireItems(mappedData);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
          setLoading(false);
        }
      };

    
      useEffect(() => {
        fetchInventaireItems();
        setLoading(false);
      }, []);
  

    return { inventaireItems, loading, error, fetchInventaireItems };
  };
  export default useInventaireItems