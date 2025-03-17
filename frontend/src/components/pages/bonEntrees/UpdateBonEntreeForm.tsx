import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import FournisseurSelection from "../../common/FournisseurSelection";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";

type Props = {
    id: number; // ID of the Bon Entree to update
    onClose: () => void;
    fetchBonEntrees: () => void;
};

export interface Fournisseur {
    id: number;
    name: string;
}
export interface BonEntree {
    id: number;
    id_fournisseur: number;
    date: string;
    TVA: number;
    document_num: string;
  }
  

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
const formatDateForInput = (dateString: string) => {
    return dateString ? dateString.split("T")[0] : "";
};

const UpdateBonEntreeForm: React.FC<Props> = ({ id, onClose, fetchBonEntrees }) => {
    const [data, setData] = useState({
        id: 0,
        id_fournisseur: 0,
        date: "",
        TVA: 0,
        document_num: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [selectedBonEntrees, setSelectedBonEntree] = useState<BonEntree[]>([]);
    const [selectedEntrees, setSelectedEntrees] = useState<Entree[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fournisseurSearchTerm, setFournisseurSearchTerm] = useState("");
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFournisseurs = fournisseurs.filter(fournisseur =>
        fournisseur.name.toLowerCase().includes(fournisseurSearchTerm.toLowerCase())
    );

    // Fetch existing Bon Entree data
    useEffect(() => {
        const fetchBonEntreeData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }
    
                // Fetch the BonEntree data
                const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (!response.ok) throw new Error("Failed to fetch Bon Entree data.");
    
                const bonEntreeData = await response.json();
                console.log("Bon Entree to update:", bonEntreeData);
    
                setData({
                    id: bonEntreeData.id,
                    id_fournisseur: bonEntreeData.id_fournisseur,
                    date: formatDateForInput(bonEntreeData.date),
                    TVA: bonEntreeData.TVA,
                    document_num: bonEntreeData.document_num,
                });
    
                setSelectedBonEntree([bonEntreeData]);
    
                // Find and set the fournisseur
                setSelectedFournisseur(
                    fournisseurs.find((f) => f.id === bonEntreeData.id_fournisseur) || null
                );
    
                // Fetch the associated Entrees separately
                const entreesResponse = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (!entreesResponse.ok) throw new Error("Failed to fetch Entrees for this Bon Entree.");
    
                const entreesData = await entreesResponse.json();
                console.log("Fetched Entrees:", entreesData);
    
                setSelectedEntrees(entreesData.map((entree: any) => ({
                    idArticle: entree.id_article, // Fix field name
                    quantity: entree.quantity,
                    unitPrice: entree.unit_price, // Fix field name
                })));
                
    
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };
    
        if (fournisseurs.length > 0) {
            fetchBonEntreeData();
        }
    }, [id, fournisseurs]);
    

    
    // Fetch articles and fournisseurs
    useEffect(() => {
        const fetchArticlesWithQuantities = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }
        
                const [articlesRes, quantitiesRes] = await Promise.all([
                    fetch(`${Bk_End_SRVR}:5000/api/articles`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${Bk_End_SRVR}:5000/api/articles/quantities`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
        
                if (!articlesRes.ok || !quantitiesRes.ok) throw new Error("Failed to fetch data.");
        
                const articlesData: Article[] = await articlesRes.json();
                const quantitiesData: { idArticle: number; totalQuantity: number }[] = await quantitiesRes.json();
        
                const updatedArticles = articlesData.map((article) => ({
                    ...article,
                    totalQuantity: quantitiesData.find((q) => q.idArticle === article.id)?.totalQuantity || 0,
                }));
        
                setArticles(updatedArticles);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        };
        

        const fetchFournisseurs = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const response = await fetch(`${Bk_End_SRVR}:5000/api/fournisseurs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch fournisseurs.");

                const fournisseursData: Fournisseur[] = await response.json();
                setFournisseurs(fournisseursData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };

        fetchArticlesWithQuantities();
        fetchFournisseurs();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: name === "TVA" ? parseFloat(value) || 0 : value, // Convert TVA to number
        }));
    };
    
    const handleArticleSelect = (article: Article) => {
        setSelectedEntrees((prevEntrees) => {
            const newEntries = new Map(prevEntrees.map((e) => [e.idArticle, e]));
            if (newEntries.has(article.id!)) {
                newEntries.delete(article.id!);
            } else {
                newEntries.set(article.id!, { idArticle: article.id!, quantity: 1, unitPrice: 0 });
            }
            return Array.from(newEntries.values());
        });
    };

    const handleFournisseurSelect = (fournisseur: Fournisseur) => {
        setSelectedFournisseur(fournisseur);
        setData({ ...data, id_fournisseur: fournisseur.id });
    };

    const handleEntreeChange = (index: number, field: keyof Entree, value: number) => {
        setSelectedEntrees((prevEntrees) => {
            const updatedEntrees = [...prevEntrees];
            updatedEntrees[index] = { ...updatedEntrees[index], [field]: value };
            return updatedEntrees;
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                setIsLoading(false);
                return;
            }
    
            if (!id) {
                setError("Invalid Bon Entree ID.");
                setIsLoading(false);
                return;
            }
    
            const payload = {
                ...data,
                entrees: selectedEntrees,
            };
    
            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) throw new Error("Failed to update Bon Entree.");
    
            const responseData = await response.json();
            console.log("Fetched Bon Entree Data:", responseData);
    
            // Reset form and close modal
            setData({ id: 0, id_fournisseur: 0, date: "", TVA: 0, document_num: "" });
            setSelectedEntrees([]);
            setSelectedFournisseur(null);
            fetchBonEntrees(); // Refresh the list of Bon Entrees
            onClose(); // Close the modal
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث وصل استلام</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {error && <p className="text-danger">{error}</p>}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Input label="التاريخ" type="date" name="date" value={data.date} onChange={handleChange} />
                                </div>

                                <div className="col-md-6">
                                    <Input label="رقم الوثيقة" type="text" name="document_num" value={data.document_num} onChange={handleChange} />
                                </div>
                            </div>

                            <FormGroup label="المورد">
                                <SearchInput
                                    placeholder="ابحث عن المورد..."
                                    value={fournisseurSearchTerm}
                                    onChange={(e) => setFournisseurSearchTerm(e.target.value)}
                                />
                                <FournisseurSelection
                                    fournisseurs={filteredFournisseurs}
                                    selectedFournisseur={selectedFournisseur}
                                    onFournisseurSelect={handleFournisseurSelect}
                                />
                            </FormGroup>

                            <FormGroup label="حدد المقالات لإضافتها">
                                <SearchInput
                                    placeholder="ابحث عن المقال..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <ArticleSelection
                                    articles={filteredArticles}
                                    selectedEntrees={selectedEntrees}
                                    onArticleSelect={handleArticleSelect}
                                />
                            </FormGroup>

                            <SelectedArticlesTable
                                selectedEntrees={selectedEntrees}
                                articles={articles}
                                onEntreeChange={handleEntreeChange}
                            />

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                    {isLoading ? "جاري التحديث..." : "تحديث"}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBonEntreeForm;