import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { Retour } from "../../models/retourType";
import { BonRetour } from "../../models/bonRetourTypes";


const useBonRetourDetails = (bonRetour_id: string) => {
    const [bonRetour, setBonRetour] = useState<BonRetour>();
    const [retours, setRetours] = useState<Retour[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fetchBonRetour = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            // Fetch bonRetour and retours simultaneously
            const [bonRetourRes, retoursRes] = await Promise.all([
                fetch(`${Bk_End_SRVR}:5000/api/bonretours/${bonRetour_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${Bk_End_SRVR}:5000/api/bonretours/retour/${bonRetour_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (!bonRetourRes.ok || !retoursRes.ok) throw new Error("Failed to fetch BonRetour details.");

            const bonRetourData = await bonRetourRes.json();
            const retoursData = await retoursRes.json();  
            setBonRetour(bonRetourData);
            setRetours(retoursData)

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {


        fetchBonRetour();
    }, [bonRetour_id]);
return {bonRetour,retours,error,isLoading}
}

export default useBonRetourDetails