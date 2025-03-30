import React, { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import { Fournisseur } from "../../../models/fournisseurTypes";
import { Entree } from "../../../models/entreeTypes";
import { Article } from "../../../models/articleTypes";
import SelectionList from "../../common/SelectionList";
import useFornisseurs from "../../../services/fornisseurs/useFornisseurs";
import useFetchArticles from "../../../services/article/usefetchArticles";

type Props = {
    id: number;
    onClose: () => void;
    fetchBonEntrees: () => void;
};

const UpdateBonEntreeForm: React.FC<Props> = ({ id, onClose, fetchBonEntrees }) => {
    const [data, setData] = useState({
        id_fournisseur: 0,
        date: "",
        TVA: 0,
        document_num: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [selectedEntrees, setSelectedEntrees] = useState<Entree[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fournisseurSearchTerm, setFournisseurSearchTerm] = useState("");
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { fournisseurs } = useFornisseurs();
    const {articles,loading} =useFetchArticles();

    // Fetch Bon Entree data when the component mounts
    useEffect(() => {
        const fetchBonEntreeData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const [bonEntreeRes, entreesRes] = await Promise.all([
                    fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                if (!bonEntreeRes.ok || !entreesRes.ok) throw new Error("Failed to fetch data.");

                const bonEntreeData = await bonEntreeRes.json();
                const entreesData = await entreesRes.json();

                setData({
                    id_fournisseur: bonEntreeData.id_fournisseur,
                    date: bonEntreeData.date.split("T")[0],
                    TVA: bonEntreeData.TVA,
                    document_num: bonEntreeData.document_num,
                });

                setSelectedEntrees(entreesData.map((entree: any) => ({
                    idArticle: entree.id_article,
                    quantity: entree.quantity,
                    unitPrice: entree.unit_price,
                })));

                setSelectedFournisseur(fournisseurs.find((f) => f.id === bonEntreeData.id_fournisseur) || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        };

        if (id && fournisseurs.length > 0) fetchBonEntreeData();
    }, [id, fournisseurs]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    entrees: selectedEntrees,
                }),
            });

            if (!response.ok) throw new Error("Failed to update Bon Entree.");

            fetchBonEntrees();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setData((prevData) => ({
                ...prevData,
                [name]: name === "TVA" ? parseFloat(value) || 0 : value, // Convert TVA to number
            }));
        };
        const filteredArticles = articles.filter(article =>
            article.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
     

          const handleArticleSelect = (article: Article) => {
                setSelectedEntrees((prevEntrees) => {
                    console.log("prevEntrees",prevEntrees)
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
        
          const handleEntreeChange = <K extends keyof Entree>(
                index: number,
                field: K,
                value: Entree[K]
            ) => {
                if (value === undefined) return; // Prevent assignment of `undefined`
                setSelectedEntrees((prev) =>
                    prev.map((entree, i) =>
                        i === index ? { ...entree, [field]: value } : entree
                    )
                );
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
                        {loading ? (
                            <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
                        ) : (
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
                           <SelectionList
    items={fournisseurs}
    selectedItem={selectedFournisseur}
    onSelect={handleFournisseurSelect}
    getItemLabel={(fournisseur) => fournisseur.name}
    emptyMessage="لا يوجد موردون متاحون"
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
                                selectedItems={selectedEntrees}
                                articles={articles}
                                onItemChange={handleEntreeChange}
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBonEntreeForm;