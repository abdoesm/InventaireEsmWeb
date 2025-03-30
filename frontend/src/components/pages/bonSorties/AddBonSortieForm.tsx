import React, { useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import { Article } from "../../../models/articleTypes";
import { Sortie } from "../../../models/sortieType";
import { Employer } from "../../../models/employerType";
import { Service } from "../../../models/serviceTypes";
import SelectionList from "../../common/SelectionList";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useEmployers from "../../../services/employers/useEmployers";
import useService from "../../../services/a_services/useServices";



type Props = {
    onClose: () => void;
    fetchBonSorties: () => void;
};



const AddBonSortieForm: React.FC<Props> = ({ onClose, fetchBonSorties }) => {
    const [data, setData] = useState({
        date: "",
        id_employeur: 1,
        id_service: 0,
    });

    const [error, setError] = useState<string | null>(null);
    const [selectedSorties, setSelectedSorties] = useState<Sortie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employerSearchTerm, setEmployerSearchTerm] = useState("");
    const [serviceSearchTerm, setServiceSearchTerm] = useState("");
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);


    const { error: fetchError, loading, employers} = useEmployers();
    const { articles} =useFetchArticles();
    const { services }=useService();

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredEmployer = employers.filter(employer =>
        employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase())
        || employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
    );

    const filteredService = services.filter(
        s => s.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    )
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
        setData({ ...data, id_employeur: employer.id });
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setData({ ...data, id_service: service.id });
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
        if (!selectedService) {
            setError("الرجاء اختيار مصلحة.");
            return;
        }

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
        <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="addBonSortieModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title" id="addBonSortieModalLabel">
                            إضافة وصل خروج جديد
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="إغلاق"
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {/* Error Messages */}
                        {error && <p className="text-danger">{error}</p>}
                        {fetchError && <p className="text-danger">{fetchError}</p>}

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">جارٍ تحميل البيانات...</span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Date Input */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <input
                                            type="date"
                                            name="date"
                                            value={data.date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Employer and Service Selection Side by Side */}
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <FormGroup label="الموظف">
                                            <SearchInput
                                                placeholder="ابحث عن الموظف..."
                                                value={employerSearchTerm}
                                                onChange={(e) => setEmployerSearchTerm(e.target.value)}
                                            />
                                            <SelectionList
                                                items={filteredEmployer}
                                                selectedItem={selectedEmployer}
                                                onSelect={handleEmployerSelect}
                                                getItemLabel={(employer) => `${employer.fname} ${employer.lname}`}
                                                emptyMessage="لا يوجد موظفون متاحون"
                                            />
                                        </FormGroup>
                                    </div>

                                    <div className="col-md-6">
                                        <FormGroup label="المصلحة">
                                            <SearchInput
                                                placeholder="ابحث عن المصلحة..."
                                                value={serviceSearchTerm}
                                                onChange={(e) => setServiceSearchTerm(e.target.value)}
                                            />
                                            <SelectionList
                                                items={filteredService}
                                                selectedItem={selectedService}
                                                onSelect={handleServiceSelect}
                                                getItemLabel={(service) => service.name}
                                                emptyMessage="لا يوجد مصالح متاحون"
                                            />

                                        </FormGroup>
                                    </div>
                                </div>

                                {/* Article Selection */}
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

                                {/* Selected Articles Table */}
                                <SelectedArticlesTable<Sortie>
                                    selectedItems={selectedSorties}
                                    articles={articles}
                                    onItemChange={handleSortieChange}
                                />

                                {/* Modal Footer */}
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">
                                        إضافة
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={onClose}
                                    >
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

export default AddBonSortieForm;