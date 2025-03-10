import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";

type Props = {
    onClose: () => void;
    fetchBonEntrees: () => void;
};

export interface Article {
    id?: number;
    name: string;
    unite: string;
    remarque: string;
    description: string;
    idCategory: number;
    minQuantity: number;
    totalQuantity?: number;
}

export interface Entree {
    idArticle: number;
    quantity: number;
    unitPrice: number;
}

interface BonEntree {
    id: number;
    id_fournisseur: number;
    date: string;
    TVA: number;
    document_num: string;
}

const AddBonEntreeForm: React.FC<Props> = ({ onClose, fetchBonEntrees }) => {
    const [data, setData] = useState<BonEntree>({
        id: 0,
        id_fournisseur: 0,
        date: "",
        TVA: 0,
        document_num: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedEntrees, setSelectedEntrees] = useState<Entree[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        const fetchArticlesWithQuantities = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              setError("No token found. Please log in.");
              return;
            }
    
            const [articlesRes, quantitiesRes] = await Promise.all([
              fetch(`${Bk_End_SRVR}:5000/api/articles`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              fetch(`${Bk_End_SRVR}:5000/api/articles/quantities`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);
    
            if (!articlesRes.ok || !quantitiesRes.ok)
              throw new Error("Failed to fetch data.");
    
            const articlesData: Article[] = await articlesRes.json();
            const quantitiesData: { idArticle: number; totalQuantity: number }[] =
              await quantitiesRes.json();
    
            // Merge quantities with articles
            const updatedArticles = articlesData.map((article) => ({
              ...article,
              totalQuantity:
                quantitiesData.find((q) => q.idArticle === article.id)?.totalQuantity || 0,
            }));
    
            setArticles(updatedArticles);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred.");
            }
          }
        };
    
        fetchArticlesWithQuantities();
      }, []);



    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    function handleArticleSelect(article: Article) {
        setSelectedEntrees((prevEntrees) => {
            const newEntries = new Map(prevEntrees.map(e => [e.idArticle, e]));
            if (newEntries.has(article.id!)) {
                newEntries.delete(article.id!);
            } else {
                newEntries.set(article.id!, { idArticle: article.id!, quantity: 1, unitPrice: 0 });
            }
            return Array.from(newEntries.values());
        });
    }
    
    function handleEntreeChange(index: number, field: keyof Entree, value: number) {
        setSelectedEntrees((prevEntrees) => {
            const updatedEntrees = [...prevEntrees];
            updatedEntrees[index] = { ...updatedEntrees[index], [field]: value };
            return updatedEntrees;
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!data.date || !data.id_fournisseur) {
            setError("جميع الحقول مطلوبة.");
            return;
        }

        if (selectedEntrees.length === 0) {
            setError("يجب تحديد عنصر واحد على الأقل.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const bonEntreeResponse = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });

            if (!bonEntreeResponse.ok) throw new Error("Failed to create Bon Entree.");

            const bonEntree: BonEntree = await bonEntreeResponse.json();

            for (const entree of selectedEntrees) {
                const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ ...entree, idBe: bonEntree.id }),
                });

                if (!response.ok) console.error("Failed to create Entree:", await response.text());
            }

            fetchBonEntrees();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    }

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">إضافة بون دخول جديد</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        {error && <p className="text-danger">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <Input label="التاريخ" type="date" name="date" value={data.date} onChange={handleChange} />
                            <Input label="رقم المورد" type="number" name="id_fournisseur" value={data.id_fournisseur} onChange={handleChange} />
                            <Input label="رقم الوثيقة" type="text" name="document_num" value={data.document_num} onChange={handleChange} />
                            <label className="form-label">حدد المقالات لإضافتها</label>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="ابحث عن المقال..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <ArticleSelection articles={filteredArticles} selectedEntrees={selectedEntrees} onArticleSelect={handleArticleSelect} />
                            <SelectedArticlesTable selectedEntrees={selectedEntrees} articles={articles} onEntreeChange={handleEntreeChange} />

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">إضافة</button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};



// Article Selection Component
const ArticleSelection: React.FC<{ articles: Article[]; selectedEntrees: Entree[];
     onArticleSelect: (article: Article) => void }> = ({ articles, selectedEntrees, onArticleSelect }) => (
    <div className="mb-3" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
       
       <ul className="list-group">
                  {articles.map((article) => (
                    <li
                      key={article.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {article.name} | {article.unite} | الكمية:{" "}
                        <strong>{article.totalQuantity}</strong> | الحد الأدنى:{" "}
                        {article.minQuantity}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedEntrees.some((e) => e.idArticle === article.id)}
                        onChange={() => onArticleSelect(article)}
                      />
                    </li>
                  ))}
                </ul>
    </div>
);


const SelectedArticlesTable: React.FC<{ 
    selectedEntrees: Entree[];
    articles: Article[];
    onEntreeChange: (index: number, field: keyof Entree, value: number) => void;
}> = ({ selectedEntrees, articles, onEntreeChange }) => {
    return (
        <div className="mb-3">
            <h5>المقالات المحددة</h5>
            {selectedEntrees.length === 0 ? (
                <p className="text-muted">لم يتم تحديد أي مقالات.</p>
            ) : (
                <div >
                    <table className="table table-striped">
                        <thead className="table-light">
                            <tr>
                                <th>المقال</th>
                                <th>الكمية</th>
                                <th>سعر الوحدة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedEntrees.map((entree, index) => {
                                const article = articles.find(a => a.id === entree.idArticle);
                                return (
                                    <tr key={entree.idArticle}>
                                        <td>{article?.name || "غير معروف"}</td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                value={entree.quantity} 
                                                min="1"
                                                onChange={(e) => onEntreeChange(index, "quantity", parseFloat(e.target.value) || 1)}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                value={entree.unitPrice} 
                                                min="0"
                                                onChange={(e) => onEntreeChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};





export default AddBonEntreeForm;
