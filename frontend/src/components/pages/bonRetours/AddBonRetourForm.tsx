import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";

import { Employer } from "../../../models/employerType";
import { Article } from "../../../models/articleTypes";
import { Retour } from "../../../models/retourType";
import SelectionList from "../../common/SelectionList";
import { Service } from "../../../models/serviceTypes";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useEmployers from "../../../services/employers/useEmployers";

type Props = {
    onClose: () => void;
    fetchBonRetours: () => void;
};

const AddBonRetourForm: React.FC<Props> = ({ onClose, fetchBonRetours }) => {
    const [data, setData] = useState({
        id_employeur: 0,
        id_service: 0, // ✅ Add this
        date: "",
        document_num: "",
        return_reason: "", // ✅ Add this
    });


    const [error, setError] = useState<string | null>(null);
    const [selectedRetours, setSelectedRetours] = useState<Retour[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employeurSearchTerm, setEmployeurSearchTerm] = useState("");
    const [selectedEmployeur, setSelectedEmployeur] = useState<Employer | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [serviceSearchTerm, setServiceSearchTerm] = useState("");
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );


    const { articles } = useFetchArticles();
const {employers }=useEmployers()
    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredEmployer = employers.filter(employer =>
        employer.fname.toLowerCase().includes(employeurSearchTerm.toLowerCase())
        || employer.lname.toLowerCase().includes(employeurSearchTerm.toLowerCase())
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleArticleSelect = (article: Article) => {
        setSelectedRetours((prevSorties) => {
            const newEntries = new Map(prevSorties.map((s) => [s.idArticle, s]));
            if (newEntries.has(article.id!)) {
                newEntries.delete(article.id!);
            } else {
                newEntries.set(article.id!, {
                    idArticle: article.id!,
                    quantity: 1,
                    id_br: 0  // Ensure idBs is included
                });
            }
            return Array.from(newEntries.values());
        });
    };
    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const response = await fetch(`${Bk_End_SRVR}:5000/api/services`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to fetch services.");

            const data: Service[] = await response.json();
            setServices(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEmployeurSelect = (employeur: Employer) => {
        setSelectedEmployeur(employeur);
        setData({ ...data, id_employeur: employeur.id });
    };
    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setData(prevData => ({
            ...prevData,
            id_service: service.id || prevData.id_service, // Ensure a valid service ID
        }));
    };


    const handleRetourChange = <K extends keyof Retour>(index: number, field: K, value: Retour[K]) => {
        if (value === undefined) return;
        setSelectedRetours((prevRetours) => {
            const updatedRetours = [...prevRetours];
            updatedRetours[index] = { ...updatedRetours[index], [field]: value };
            return updatedRetours;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployeur) {
            setError("الرجاء اختيار موظف.");
            return;
        }
        if (!data.id_service) {
            setError("الرجاء اختيار مصلحة.");
            return;
        }
        if (selectedRetours.length === 0) {
            setError("الرجاء إضافة مقالات.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            const requestBody = {
                id_employeur: data.id_employeur,
                id_service: data.id_service,  // ✅ Ensure this is included
                date: data.date,
                return_reason: data.return_reason,  // ✅ Ensure this is included
                retours: selectedRetours.map(retour => ({
                    id_article: retour.idArticle,  // ✅ Correct field name
                    quantity: retour.quantity
                }))
            };

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("فشل في إضافة وصل الإرجاع.");

            fetchBonRetours();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير معروف.");
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">إضافة وصل إرجاع جديد</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {error && <p className="text-danger">{error}</p>}
    
                        <form onSubmit={handleSubmit}>
                            {/* Employee Selection */}
                            <SearchInput
                                placeholder="ابحث عن الموظف"
                                value={employeurSearchTerm}
                                onChange={(e) => setEmployeurSearchTerm(e.target.value)}
                            />
    
                            <SelectionList
                                items={filteredEmployer}
                                selectedItem={selectedEmployeur}
                                onSelect={handleEmployeurSelect}
                                getItemLabel={(employer) => `${employer.fname} ${employer.lname}`}
                                emptyMessage="لا يوجد موظفون متاحون"
                            />
    
                            {/* Date Input */}
                            <FormGroup label="التاريخ">
                                <Input type="date" name="date" value={data.date} onChange={handleChange} />
                            </FormGroup>
    
                            {/* Service Selection */}
                            <FormGroup label="المصلحة">
                                <SearchInput
                                    placeholder="ابحث عن المصلحة"
                                    value={serviceSearchTerm}
                                    onChange={(e) => setServiceSearchTerm(e.target.value)}
                                />
    
                                <SelectionList
                                    items={filteredServices}
                                    selectedItem={selectedService}
                                    onSelect={handleServiceSelect}
                                    getItemLabel={(service) => service.name}
                                    emptyMessage="لا يوجد مصالح متاحة"
                                />
                            </FormGroup>
    
                            {/* Return Reason */}
                            <FormGroup label="سبب الإرجاع">
                                <Input
                                    type="text"
                                    name="return_reason"
                                    value={data.return_reason}
                                    onChange={handleChange}
                                    placeholder="أدخل سبب الإرجاع"
                                />
                            </FormGroup>
    
                            {/* Article Selection */}
                            <ArticleSelection
                                articles={filteredArticles}
                                selectedEntrees={selectedRetours}
                                onArticleSelect={handleArticleSelect}
                            />
    
                            <SelectedArticlesTable
                                selectedItems={selectedRetours}
                                articles={articles}
                                onItemChange={handleRetourChange}
                            />
    
                            {/* Modal Footer */}
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

export default AddBonRetourForm;