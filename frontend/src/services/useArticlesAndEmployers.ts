import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../configs/conf";
import { Article } from "../models/articleTypes";
import { Employer } from "../models/employerType";

const useArticlesAndEmployers = () => {
  const [articles, setArticles] = useState<Article[]>([]);
   const [employers, setEmployers] = useState<Employer[]>([]);
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

      const [articlesRes, quantitiesRes, employerRes] = await Promise.all([

        fetch(`${Bk_End_SRVR}:5000/api/articles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),


        fetch(`${Bk_End_SRVR}:5000/api/articles/quantities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),

        fetch(`${Bk_End_SRVR}:5000/api/employers`, {
                headers: { Authorization: `Bearer ${token}` },
              })
      ])

      if (!articlesRes.ok|| !quantitiesRes.ok || !employerRes.ok) throw new Error("Failed to fetch articles.");

      const articlesData = await articlesRes.json();
      const quantitiesData: { idArticle: number; totalQuantity: number }[] =
      await quantitiesRes.json();
      articlesData.forEach((article: Article) => {
        const quantityInfo = quantitiesData.find((q) => q.idArticle === article.id);
        article.totalQuantity = quantityInfo ? quantityInfo.totalQuantity : 0;
    });
    const employerData = await employerRes.json();
    setArticles(articlesData);
     setEmployers(employerData)
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return { articles, loading, error, fetchArticles,employers };
};

export default useArticlesAndEmployers;