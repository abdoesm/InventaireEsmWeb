import { useEffect, useState } from "react";
import { Employer } from "../../models/employerType";
import { Bk_End_SRVR } from "../../configs/conf";

const useEmployers = ()=>{
const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

    const fetchEmployers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
  
        const response = await fetch(`${Bk_End_SRVR}:5000/api/employers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch employers.");
  
        const data: Employer[] = await response.json();
        console.log(data);
        setEmployers(data);
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
      fetchEmployers();
    }, []);
    return { employers,error,loading,fetchEmployers}
}
export default useEmployers;