import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../configs/conf";
import { Localisation } from "../models/localisationType";


 
 const useLocation = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [localisations, setLocalisations] = useState<Localisation[]>([]);
    const fetchLocalisations = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
          }
    
          const response = await fetch(`${Bk_End_SRVR}:5000/api/localisations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (!response.ok) throw new Error("Failed to fetch localisations.");
    
          const data: Localisation[] = await response.json();
          setLocalisations(data);
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
        fetchLocalisations();
      }, []);
   return  {localisations,loading,error,fetchLocalisations}
   
 }
 
 export default useLocation
