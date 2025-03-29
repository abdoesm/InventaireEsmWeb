import { useState, useEffect } from "react";
import { Service } from "../../models/serviceTypes";
import { Bk_End_SRVR } from "../../configs/conf";


 
 const useService = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const fetchServices = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found. Please log in.");
            setLoading(false);
            return;
          }
          const response = await fetch(`${Bk_End_SRVR}:5000/api/services`);
                if (!response.ok) throw new Error("Failed to fetch services");
                const servicesData = await response.json();
                setServices(servicesData);
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
        fetchServices();
      }, []);
   return  {services,loading,error,fetchServices}
   
 }
 
 export default useService;
