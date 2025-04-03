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
import useBonEntreeDetails from "../../../services/bonEntrees/useBonEntreeDetails";
import DateInput from "../../common/DateInput";
import Modal from "../../common/Modal";

type Props = {
    id: string;
    onClose: () => void;
    fetchBonEntrees: () => void;
};

const UpdateBonEntreeForm: React.FC<Props> = ({ id, onClose, fetchBonEntrees }) => {
    const { bonEntree, mapEntrees, loading, error } = useBonEntreeDetails(id);

    const { fournisseurs } = useFornisseurs();
    const { articles } = useFetchArticles();
    const [data, setData] = useState({
        id_fournisseur: 0,
        date: "",
        TVA: 0,
        document_num: "",
    });


    const [selectedEntrees, setSelectedEntrees] = useState<Entree[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [fournisseurSearchTerm, setFournisseurSearchTerm] = useState("");
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
    const [isLoading, setIsLoading] = useState(false);




    // Fetch Bon Entree data when the component mounts
    useEffect(() => {
        if (bonEntree) {
            setData({
                id_fournisseur: bonEntree.id_fournisseur,
                date: bonEntree.date.split("T")[0],
                TVA: bonEntree.TVA,
                document_num: bonEntree.document_num,
            });

            setSelectedEntrees(mapEntrees.map(entree => ({
                idArticle: entree.id_article,
                quantity: entree.quantity,
                unitPrice: entree.unit_price,
            })));
            setSelectedFournisseur(fournisseurs.find(f => f.id === bonEntree.id_fournisseur) || null);
        }

    }, [bonEntree, mapEntrees, fournisseurs]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Please log in.");
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
            console.error(err instanceof Error ? err.message : "An unknown error occurred.");
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
            console.log("prevEntrees", prevEntrees)
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
        <>
        <Modal isOpen={true} onClose={onClose} title="تحديث وصل إستلام">
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
                                <div className="row">
                                  
                                        <DateInput label="التاريخ"  name="date" value={data.date} onChange={handleChange} />
                                  

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
      </Modal>
    </>
    );
};

export default UpdateBonEntreeForm;