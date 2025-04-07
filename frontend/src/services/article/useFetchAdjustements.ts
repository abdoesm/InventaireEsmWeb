import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { Adjustement } from "../../models/adjustementTypes";  // Assuming you have this type defined.

const useFetchAdjustements = () => {
  const [adjustments, setAdjustments] = useState<Adjustement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdjustments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const adjustmentsRes = await fetch(`${Bk_End_SRVR}:5000/api/articles/adjustments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!adjustmentsRes.ok) throw new Error("Failed to fetch adjustments.");

      const adjustmentsData: Adjustement[] = await adjustmentsRes.json();
      console.log("Fetched adjustments:", adjustmentsData);
      setAdjustments(adjustmentsData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  return { adjustments, loading, error, fetchAdjustments };
};

export default useFetchAdjustements;
