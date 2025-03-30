import React, { useState, useEffect } from "react";
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
import { BonSortie } from "../../../models/bonSortieType";
import useEmployers from "../../../services/employers/useEmployers";
import useService from "../../../services/a_services/useServices";
import useFetchArticles from "../../../services/article/usefetchArticles";

type Props = {
    id: number;
    onClose: () => void;
    fetchBonSorties: () => void;
};

const UpdateBonSortieForm: React.FC<Props> = ({ id, onClose, fetchBonSorties }) => {
    const [data, setData] = useState<BonSortie>({ id: 0, id_employeur: 0, id_service: 0, date: "" });



    const [error, setError] = useState<string | null>(null);
    const [selectedSorties, setSelectedSorties] = useState<Sortie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employerSearchTerm, setEmployerSearchTerm] = useState("");
    const [serviceSearchTerm, setServiceSearchTerm] = useState("");
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { articles } = useFetchArticles();
    const {employers} =useEmployers();
    const { services}= useService();
  

    // Fetch Bon Sortie data when the component mounts
    useEffect(() => {
        const fetchBonSortieData = async () => {
            if (!id || employers.length === 0 || services.length === 0) return;
    
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }
    
                const [bonSortieRes, sortiesRes] = await Promise.all([
                    fetch(`${Bk_End_SRVR}:5000/api/bonsorties/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${Bk_End_SRVR}:5000/api/bonsorties/sortie/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
    
                if (!bonSortieRes.ok || !sortiesRes.ok) throw new Error("Failed to fetch data.");
    
                const bonSortieData = await bonSortieRes.json();
                const sortiesData = await sortiesRes.json();
    
                setData({
                    id: bonSortieData.id,
                    date: bonSortieData.date.split("T")[0],
                    id_employeur: bonSortieData.id_employeur,
                    id_service: bonSortieData.id_service,
                });
    
                setSelectedSorties(sortiesData.map((sortie: any) => ({
                    idArticle: sortie.id_article,
                    quantity: sortie.quantity,
                    idBs: sortie.id_bs,
                })));
    
                setSelectedEmployer(employers.find((emp) => emp.id === bonSortieData.id_employeur) || null);
                setSelectedService(services.find((serv) => serv.id === bonSortieData.id_service) || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            }
        };
    
        fetchBonSortieData();
    }, [id, employers, services]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => prevData ? { ...prevData, [name]: value } : { id: 0, id_employeur: 0, id_service: 0, date: "" });
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
                    idBs: id, // Associate with current bon sortie
                });
            }
            return Array.from(newEntries.values());
        });
    };

    const handleSortieChange = <K extends keyof Sortie>(index: number, field: K, value: Sortie[K]) => {
        setSelectedSorties((prevSorties) => {
            const updatedSorties = [...prevSorties];
            updatedSorties[index] = {
                ...updatedSorties[index],
                [field]: (value ?? 0) as number,
            };
            return updatedSorties;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonsorties/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    sorties: selectedSorties,
                }),
            });

            if (!response.ok) throw new Error("Failed to update Bon Sortie.");

            fetchBonSorties();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredEmployers = employers.filter(employer =>
        employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase()) ||
        employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
    );

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث وصل خروج</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {error && <p className="text-danger">{error}</p>}
                
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-secondary" role="status">
                                    <span className="visually-hidden">جارٍ تحميل البيانات...</span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <FormGroup label="التاريخ">
                                    <input type="date" name="date" value={data.date} onChange={handleChange} required />
                                </FormGroup>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <FormGroup label="الموظف">
                                            <SearchInput
                                                placeholder="ابحث عن الموظف..."
                                                value={employerSearchTerm}
                                                onChange={(e) => setEmployerSearchTerm(e.target.value)}
                                            />
                                            <SelectionList
                                                items={filteredEmployers}
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
                                                items={filteredServices}
                                                selectedItem={selectedService}
                                                onSelect={handleServiceSelect}
                                                getItemLabel={(service) => service.name}
                                                emptyMessage="لا يوجد مصالح متاحون"
                                            />
                                        </FormGroup>
                                    </div>
                                </div>

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
                                    selectedItems={selectedSorties}
                                    articles={articles}
                                    onItemChange={handleSortieChange}
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

export default UpdateBonSortieForm;

