import { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { Article } from "../../models/articleTypes";
import { Employer } from "../../models/employerType";
import { Service } from "../../models/serviceTypes";

interface QuantityInfo {
  idArticle: number;
  totalQuantity: number;
}

const useArticlesAndEmployersAndServices = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
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

      const [articlesRes, quantitiesRes, employerRes, servicesRes] = await Promise.all([
        fetch(`${Bk_End_SRVR}:5000/api/articles`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${Bk_End_SRVR}:5000/api/articles/quantities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${Bk_End_SRVR}:5000/api/employers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${Bk_End_SRVR}:5000/api/services`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!articlesRes.ok || !quantitiesRes.ok || !employerRes.ok || !servicesRes.ok) {
        throw new Error("Failed to fetch data.");
      }

      const articlesData: Article[] = await articlesRes.json();
      const quantitiesData: QuantityInfo[] = await quantitiesRes.json();
      const employerData: Employer[] = await employerRes.json();
      const servicesData: Service[] = await servicesRes.json();

      // Combine articles with their quantities
      articlesData.forEach((article) => {
        const quantityInfo = quantitiesData.find((q) => q.idArticle === article.id);
        article.totalQuantity = quantityInfo ? quantityInfo.totalQuantity : 0;
      });

      setArticles(articlesData);
      setEmployers(employerData);
      setServices(servicesData);
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

  return { articles, employers, services, loading, error, fetchArticles };
};

export default useArticlesAndEmployersAndServices;