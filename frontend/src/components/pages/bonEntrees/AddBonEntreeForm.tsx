import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import FournisseurSelection from "../../common/FournisseurSelection";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import useArticlesAndFournisseurs from "../../../services/useArticlesAndFournisseurs";
import { Fournisseur } from "../../../models/fournisseurTypes";
import { Article } from "../../../models/articleTypes";


type Props = {
    onClose: () => void;
    fetchBonEntrees: () => void;
};

export interface Entree {
    idArticle: number;
    quantity: number;
    unitPrice: number;
}

const AddBonEntreeForm: React.FC<Props> = ({ onClose, fetchBonEntrees }) => {
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

    const { articles, fournisseurs, error: fetchError, loading } = useArticlesAndFournisseurs();

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFournisseurs = fournisseurs.filter(fournisseur =>
        fournisseur.name.toLowerCase().includes(fournisseurSearchTerm.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: name === "TVA" ? parseFloat(value) || 0 : value,
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
        if (!selectedFournisseur) {
            setError("الرجاء اختيار مورد.");
            return;
        }

        if (selectedEntrees.length === 0) {
            setError("الرجاء إضافة مقالات.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonentrees`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    entrees: selectedEntrees,
                }),
            });

            if (!response.ok) throw new Error("فشل في إضافة وصل الاستلام.");

            fetchBonEntrees();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">إضافة وصل استلام جديد</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {error && <p className="text-danger">{error}</p>}
                        {fetchError && <p className="text-danger">{fetchError}</p>}
                        {loading ? (
                            <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
                        ) : (
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
                        <button type="submit"  className="btn btn-primary">إضافة</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                    </div>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBonEntreeForm;