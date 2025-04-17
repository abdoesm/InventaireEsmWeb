import { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { InventaireItem } from "../../models/inventaireItemType";

const useInventaireItemDetails = (id: number | string) => {
  const [item, setItem] = useState<InventaireItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/inventaire/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch inventaire item details.");

      const data = await response.json();

      const mappedItem: InventaireItem = {
        id: data.id,
        idArticle: data.id_article,
        idUser: data.user_id,
        idLocalisation: data.id_localisation,
        idEmployer: data.id_employer,
        numInventaire: data.num_inventaire,
        dateInventaire: data.time,
        status: data.status,
      };

      setItem(mappedItem);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  return { item, loading, error, refetch: fetchItemDetails };
};

export default useInventaireItemDetails;
