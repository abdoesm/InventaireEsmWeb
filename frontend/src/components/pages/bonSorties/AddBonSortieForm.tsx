import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import useArticlesAndEmployers from "../../../services/useArticlesAndEmployers";
import { Article } from "../../../models/articleTypes";
import { Sortie } from "../../../models/sortieType";
import { Employer } from "../../../models/employerType";
import EmployerSelection from "../../common/EmployerSelection";


type Props = {
    onClose: () => void;
    fetchBonSorties: () => void;
};



const AddBonSortieForm: React.FC<Props> = ({ onClose, fetchBonSorties }) => {
    const [data, setData] = useState({
        date: "",
        document_num: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [selectedSorties, setSelectedSorties] = useState<Sortie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employerSearchTerm, setEmployerSearchTerm] = useState("");
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);

    const { articles, error: fetchError, loading,employers } = useArticlesAndEmployers();

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredEmployer = employers.filter(employer =>
        employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase())
        || employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleArticleSelect = (article: Article) => {
        setSelectedSorties((prevSorties) => {
            const newEntries = new Map(prevSorties.map((s) => [s.idArticle, s]));
            if (newEntries.has(article.id!)) {
                newEntries.delete(article.id!);
            } else {
                newEntries.set(article.id!, { 
                    idArticle: article.id!, 
                    quantity: 1, 
                    idBs: 0  // Ensure idBs is included
                });
            }
            return Array.from(newEntries.values());
        });
    };
    
       const handleEmployerSelect = (employer: Employer) => {
            setSelectedEmployer(employer);
            setData({ ...data });
        };

    const handleSortieChange = <K extends keyof Sortie>(index: number, field: K, value: Sortie[K]) => {
        setSelectedSorties((prevSorties) => {
            const updatedSorties = [...prevSorties];
            updatedSorties[index] = {
                ...updatedSorties[index],
                [field]: (value ?? 0) as number, // Ensure it's always a number
            };
            return updatedSorties;
        });
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployer) {
            setError("الرجاء اختيار موظف.");
            return;
        }

        if (selectedSorties.length === 0) {
            setError("الرجاء إضافة مقالات.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonsorties`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    sorties: selectedSorties,
                }),
            });

            if (!response.ok) throw new Error("فشل في إضافة وصل الخروج.");

            fetchBonSorties();
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
                        <h5 className="modal-title">إضافة وصل خروج جديد</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {error && <p className="text-danger">{error}</p>}
                        {fetchError && <p className="text-danger">{fetchError}</p>}
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
                                  {/* Supplier Selection */}
                                  <FormGroup label="المورد">
                                    <SearchInput
                                        placeholder="ابحث عن المورد..."
                                        value={employerSearchTerm}
                                        onChange={(e) => setEmployerSearchTerm(e.target.value)}
                                    />
                                    <EmployerSelection
                                        employers={filteredEmployer}
                                        selectedEmployer={selectedEmployer}
                                        onEmployerSelect={handleEmployerSelect}
                                    />
                                </FormGroup>
                                <FormGroup label="حدد المقالات للخروج">
                                    <SearchInput
                                        placeholder="ابحث عن المقال..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    
                                    <ArticleSelection<Sortie>
                                        articles={filteredArticles}
                                        selectedEntrees={selectedSorties}
                                        onArticleSelect={handleArticleSelect}
                                    />
                                </FormGroup>
                                <SelectedArticlesTable<Sortie>
                                    selectedEntrees={selectedSorties}
                                    articles={articles}
                                    onEntreeChange={handleSortieChange}
                                />
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">إضافة</button>
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

export default AddBonSortieForm;