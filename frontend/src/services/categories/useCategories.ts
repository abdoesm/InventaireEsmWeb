import { useEffect, useState } from "react";
import { Category } from "../../models/categoryTypes";
import { Bk_End_SRVR } from "../../configs/conf";


const useCategories = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }
  
        const response = await fetch(`${Bk_End_SRVR}:5000/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) throw new Error("Failed to fetch categories.");
  
        const data: Category[] = await response.json();
        console.log(data);
        setCategories(data);
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
      fetchCategories();
    }, []);
    return { categories, loading, error, fetchCategories };
}

export default useCategories;