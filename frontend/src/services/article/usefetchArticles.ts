import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { Article } from "../../models/articleTypes";

interface QuantityInfo {
  idArticle: number;
  totalQuantity: number;
}
const useFetchArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const articlesRes = await fetch(`${Bk_End_SRVR}:5000/api/articles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const  quantitiesRes = await fetch(`${Bk_End_SRVR}:5000/api/articles/quantities`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!articlesRes.ok ) throw new Error("Failed to fetch articles.");
      if(!quantitiesRes.ok) throw new Error("Failed to fetch quantitis ");

      const articlesData: Article[] = await articlesRes.json();
      
      const quantitiesData: QuantityInfo[] = await quantitiesRes.json();
        // Combine articles with their quantities
        articlesData.forEach((article) => {
          const quantityInfo = quantitiesData.find((q) => q.idArticle === article.id);
          article.totalQuantity = quantityInfo ? quantityInfo.totalQuantity : 0;
        });
        console.log("articlesData with quantities" ,articlesData)
        setArticles(articlesData);
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
    fetchArticles();
  }, []);

  return { articles, loading, error, fetchArticles };
};

export default useFetchArticles;