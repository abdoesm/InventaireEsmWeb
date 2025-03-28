import { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../configs/conf";
import { Article } from "../../models/articleTypes";
import { Fournisseur } from "../../models/fournisseurTypes";


const useArticlesAndFournisseurs = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const [articlesRes,  quantitiesRes,fournisseursRes] = await Promise.all([
                    fetch(`${Bk_End_SRVR}:5000/api/articles`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${Bk_End_SRVR}:5000/api/articles/quantities`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${Bk_End_SRVR}:5000/api/fournisseurs`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                if (!articlesRes.ok || !fournisseursRes.ok||!quantitiesRes.ok) throw new Error("Failed to fetch data.");

                const articlesData = await articlesRes.json();
                const fournisseursData = await fournisseursRes.json();
                const quantitiesData: { idArticle: number; totalQuantity: number }[] =
                await quantitiesRes.json();

                articlesData.forEach((article: Article) => {
                    const quantityInfo = quantitiesData.find((q) => q.idArticle === article.id);
                    article.totalQuantity = quantityInfo ? quantityInfo.totalQuantity : 0;
                });
                setArticles(articlesData);
                
            

                setArticles(articlesData);
                setFournisseurs(fournisseursData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { articles, fournisseurs, error, loading };
};

export default useArticlesAndFournisseurs;