import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";

type Props = {
    onClose: () => void;
    fetchBonEntrees: () => void;
    bonEntreeId: number; // Add this prop to receive the Bon Entree ID to update
};

export interface Fournisseur {
    id: number;
    name: string;
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

interface BonEntree {
    id: number;
    id_fournisseur: number;
    date: string;
    TVA: number;
    document_num: string;
}

const UpdateBonEntreeForm: React.FC<Props> = ({ onClose, fetchBonEntrees, bonEntreeId }) => {
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
    const [selectedEntrees, setSelectedEntrees] = useState<Entree[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fournisseurSearchTerm, setFournisseurSearchTerm] = useState("");
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFournisseurs = fournisseurs.filter(fournisseur =>
        fournisseur.name.toLowerCase().includes(fournisseurSearchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchBonEntreeData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${bonEntreeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch Bon Entree data.");

                const bonEntreeData: BonEntree = await response.json();
                setData({
                    id: bonEntreeData.id,
                    id_fournisseur: bonEntreeData.id_fournisseur,
                    date: bonEntreeData.date,
                    TVA: bonEntreeData.TVA,
                    document_num: bonEntreeData.document_num,
                });

                // Fetch associated entries
                const entriesResponse = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${bonEntreeId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!entriesResponse.ok) throw new Error("Failed to fetch entries.");

                const entriesData: Entree[] = await entriesResponse.json();
                setSelectedEntrees(entriesData);

                // Fetch fournisseurs and articles
                await fetchFournisseurs();
                await fetchArticlesWithQuantities();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };

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

                // Set selected fournisseur
                const selectedFournisseur = fournisseursData.find(f => f.id === data.id_fournisseur);
                if (selectedFournisseur) {
                    setSelectedFournisseur(selectedFournisseur);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };

        fetchBonEntreeData();
    }, [bonEntreeId, data.id_fournisseur]);

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

    function handleFournisseurSelect(fournisseur: Fournisseur) {
        setSelectedFournisseur(fournisseur);
        setData({ ...data, id_fournisseur: fournisseur.id });
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

            // Update Bon Entree
            const bonEntreeResponse = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${bonEntreeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            });

            if (!bonEntreeResponse.ok) throw new Error("Failed to update Bon Entree.");

            // Update Entrees
            for (const entree of selectedEntrees) {
                const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${entree.idArticle}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ ...entree, idBe: bonEntreeId }),
                });

                if (!response.ok) console.error("Failed to update Entree:", await response.text());
            }

            fetchBonEntrees();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    }

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث وصل استلام</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>

                    {/* Scrollable Modal Body */}
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {error && <p className="text-danger">{error}</p>}

                        <form onSubmit={handleSubmit}>
                            {/* Two-column layout */}
                            <div className="row">
                                {/* Date Input */}
                                <div className="col-md-6">
                                    <Input label="التاريخ" type="date" name="date" value={data.date} onChange={handleChange} />
                                </div>

                                {/* Document Number */}
                                <div className="col-md-6">
                                    <Input label="رقم الوثيقة" type="text" name="document_num" value={data.document_num} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Supplier Selection */}
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

                            {/* Article Selection */}
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

                            {/* Selected Articles Table */}
                            <SelectedArticlesTable
                                selectedEntrees={selectedEntrees}
                                articles={articles}
                                onEntreeChange={handleEntreeChange}
                            />

                            {/* Fixed Modal Footer */}
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">تحديث</button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Fournisseur Selection Component
const FournisseurSelection: React.FC<{
    fournisseurs: Fournisseur[];
    selectedFournisseur: Fournisseur | null;
    onFournisseurSelect: (fournisseur: Fournisseur) => void;
}> = ({ fournisseurs, selectedFournisseur, onFournisseurSelect }) => (
    <div className="mb-3" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
        <ul className="list-group">
            {fournisseurs.map((fournisseur) => (
                <li
                    key={fournisseur.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() => onFournisseurSelect(fournisseur)}
                    style={{ cursor: "pointer" }}
                >
                    <span>{fournisseur.name}</span>
                    {selectedFournisseur?.id === fournisseur.id && <span>✔️</span>}
                </li>
            ))}
        </ul>
    </div>
);

// Article Selection Component
const ArticleSelection: React.FC<{ 
    articles: Article[]; 
    selectedEntrees: Entree[]; 
    onArticleSelect: (article: Article) => void 
}> = ({ articles, selectedEntrees, onArticleSelect }) => (
    <div className="mb-3" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
        <ul className="list-group">
            {articles.map((article) => {
                const isSelected = selectedEntrees.some((e) => e.idArticle === article.id);

                return (
                    <li
                        key={article.id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? "bg-light" : ""}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => onArticleSelect(article)} // Allow clicking anywhere
                    >
                        <span className="d-flex flex-wrap w-100 justify-content-between">
                            <strong>{article.name}</strong>
                            <small className="text-muted">{article.unite}</small>
                            <span>الكمية: <strong>{article.totalQuantity}</strong></span>
                        </span>

                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onArticleSelect(article)}
                            onClick={(e) => e.stopPropagation()} // Prevent parent click
                        />
                    </li>
                );
            })}
        </ul>
    </div>
);

const SelectedArticlesTable: React.FC<{
    selectedEntrees: Entree[];
    articles: Article[];
    onEntreeChange: (index: number, field: keyof Entree, value: number) => void;
}> = ({ selectedEntrees, articles, onEntreeChange }) => {
    // 🔹 Optimize lookup performance using a Map
    const articleMap = new Map(articles.map(article => [article.id, article]));

    // 🔹 Calculate totals
    const totalHT = selectedEntrees.reduce((sum, entree) => sum + entree.quantity * entree.unitPrice, 0);
    const tvaAmount = totalHT * 0.19; // Assuming 19% VAT
    const totalTTC = totalHT + tvaAmount;

    return (
        <div className="mb-3">
            <h5>المقالات المحددة</h5>
            {selectedEntrees.length === 0 ? (
                <p className="text-muted">لم يتم تحديد أي مقالات.</p>
            ) : (
                <div style={{ overflowX: "auto" }}> {/* 🔹 Handle overflow */}
                    <table className="table table-striped text-center">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "30%" }}>المقال</th>
                                <th style={{ width: "15%" }}>الكمية</th>
                                <th style={{ width: "15%" }}>سعر الوحدة</th>
                                <th style={{ width: "20%" }}>المبلغ HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedEntrees.map((entree, index) => {
                                const article = articleMap.get(entree.idArticle);
                                const montantHT = entree.quantity * entree.unitPrice;

                                return (
                                    <tr key={entree.idArticle}>
                                        <td>{article?.name || "غير معروف"}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={entree.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    onEntreeChange(index, "quantity", Math.max(1, parseFloat(e.target.value) || 1))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={entree.unitPrice}
                                                min="0"
                                                step="any"
                                                onChange={(e) =>
                                                    onEntreeChange(index, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))
                                                }
                                            />
                                        </td>
                                        <td>{montantHT.toFixed(2)} DA</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* 🔹 Totals Section */}
                    <div className="text-end mt-3">
                        <p><strong>المبلغ HT:</strong> {totalHT.toFixed(2)} DA</p>
                        <p><strong>مبلغ TVA (19%):</strong> {tvaAmount.toFixed(2)} DA</p>
                        <h5><strong>المجموع TTC:</strong> {totalTTC.toFixed(2)} DA</h5>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateBonEntreeForm;