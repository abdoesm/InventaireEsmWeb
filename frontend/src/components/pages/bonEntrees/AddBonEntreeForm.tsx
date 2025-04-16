import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";

import { Fournisseur } from "../../../models/fournisseurTypes";
import { Article } from "../../../models/articleTypes";
import { Entree } from "../../../models/entreeTypes";
import SelectionList from "../../common/SelectionList";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useFornisseurs from "../../../services/fornisseurs/useFornisseurs";
import DateInput from "../../common/DateInput";
import Modal from "../../common/Modal";


type Props = {
    onClose: () => void;
    fetchBonEntrees: () => void;
};



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

    const { articles, error: fetchError, loading } = useFetchArticles();
    const { fournisseurs} = useFornisseurs();

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

    const handleEntreeChange = <K extends keyof Entree>(index: number, field: K, value: Entree[K]) => {
        if (value === undefined) return; // Avoid assigning undefined values
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
        if(selectedEntrees.some(entree => entree.quantity <= 0)) {
            setError("الرجاء إدخال كمية أكبر من 0.");
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
        <>
        <Modal isOpen={true} onClose={onClose} title="إضافة وصل إستلام">
          {loading ? (
            <div className="loading-container">
              <p>جارٍ تحميل البيانات...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="text-danger">{`حدث خطأ: ${error}`}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

                                {/* Two-column layout */}
                                <div className="row">
                                    {/* Date Input */}
                                  <DateInput
                                        label="تاريخ الاستلام"
                                        name="date"
                                        value={data.date}
                                        onChange={handleChange}
                                    />



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
                                 <SelectionList
    items={fournisseurs}
    selectedItem={selectedFournisseur}
    onSelect={handleFournisseurSelect}
    getItemLabel={(fournisseur) => fournisseur.name}
    emptyMessage="لا يوجد موردون متاحون"
/>

                                </FormGroup>

                                {/* Article Selection */}
                                <FormGroup label="حدد المقالات لإضافتها">
                                    <SearchInput
                                        placeholder="ابحث عن المقال..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <ArticleSelection<Entree>
                                        articles={filteredArticles}
                                        selectedEntrees={selectedEntrees}
                                        onArticleSelect={handleArticleSelect}
                                    />
                                </FormGroup>

                                {/* Selected Articles Table */}
                                <SelectedArticlesTable<Entree>
                                  selectedItems  ={selectedEntrees}
                                    articles={articles}
                                    onItemChange={handleEntreeChange}
                                />
                                {/* Fixed Modal Footer */}
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">إضافة</button>
                                    <button type="button" className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                                </div>
                                </form>
        )}
      </Modal>
    </>
    );
};

export default AddBonEntreeForm;