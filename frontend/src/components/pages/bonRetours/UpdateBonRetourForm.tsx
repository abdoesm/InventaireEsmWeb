import React, { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import useArticlesAndEmployeurs from "../../../services/hooks/useArticlesAndEmployersAndServices";
import SelectionList from "../../common/SelectionList";
import { Retour } from "../../../models/retourType";
import { Service } from "../../../models/serviceTypes";
import { Employer } from "../../../models/employerType";
import { Article } from "../../../models/articleTypes";
import ArticleSelection from "../../common/ArticleSelection";

type Props = {
    onClose: () => void;
    fetchBonRetours: () => void;
    bonRetour_id: number;
};

const UpdateBonRetourForm: React.FC<Props> = ({ onClose, fetchBonRetours, bonRetour_id }) => {
    const [data, setData] = useState({
        id_employeur: 0,
        id_service: 0,
        date: "",
        document_num: "",
        return_reason: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [employeurSearchTerm, setEmployeurSearchTerm] = useState("");
    const [selectedEmployeur, setSelectedEmployeur] = useState<Employer | null>(null);
    const [selectedRetours, setSelectedRetours] = useState<Retour[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [serviceSearchTerm, setServiceSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { articles, employers, error: fetchError, loading } = useArticlesAndEmployeurs();

    // Filter Services
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );

    // Filter Articles
    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter Employers
    const filteredEmployer = employers.filter(employer =>
        employer.fname.toLowerCase().includes(employeurSearchTerm.toLowerCase()) ||
        employer.lname.toLowerCase().includes(employeurSearchTerm.toLowerCase())
    );
    useEffect(() => {
        const fetchBonRetour = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }
    
                // Fetch bonRetour and retours simultaneously
                const [bonRetourRes, retoursRes] = await Promise.all([
                    fetch(`${Bk_End_SRVR}:5000/api/bonretours/${bonRetour_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${Bk_End_SRVR}:5000/api/bonretours/retour/${bonRetour_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
    
                if (!bonRetourRes.ok || !retoursRes.ok) throw new Error("Failed to fetch BonRetour details.");
    
                const bonRetourData = await bonRetourRes.json();
                const retoursData = await retoursRes.json();
    
                // Set the main bonRetour data
                setData({
                    id_employeur: bonRetourData.id_employeur,
                    id_service: bonRetourData.id_service || 0,
                    date: bonRetourData.date.split("T")[0], // Ensure date is formatted correctly
                    document_num: bonRetourData.document_num,
                    return_reason: bonRetourData.return_reason || "",
                });
    
                // Set the selected retours
                setSelectedRetours(retoursData.map((retour: any) => ({
                    idArticle: retour.id_article,
                    quantity: retour.quantity,
                })));
    
                // Set selected employer and service
                if (employers.length > 0) {
                    setSelectedEmployeur(employers.find((e) => e.id === bonRetourData.id_employeur) || null);
                }
                if (services.length > 0) {
                    setSelectedService(services.find((s) => s.id === bonRetourData.id_service) || null);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
    
        if (bonRetour_id && employers.length > 0 && services.length > 0) fetchBonRetour();
    }, [bonRetour_id, employers, services]);
    // Fetch Services
    useEffect(() => {
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

        fetchServices();
    }, []);

    // Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle Employer Selection
    const handleEmployeurSelect = (employeur: Employer) => {
        setSelectedEmployeur(employeur);
        setData({ ...data, id_employeur: employeur.id });
    };

    // Handle Service Selection
    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setData(prevData => ({ ...prevData, id_service: service.id || prevData.id_service }));
    };

    // Handle Article Selection
    const handleArticleSelect = (article: Article) => {
        setSelectedRetours((prevRetours) => {
            const newEntries = new Map(prevRetours.map((s) => [s.idArticle, s]));
            if (newEntries.has(article.id!)) {
                newEntries.delete(article.id!);
            } else {
                newEntries.set(article.id!, {
                    idArticle: article.id!,
                    quantity: 1,
                    id_br: 0,
                });
            }
            return Array.from(newEntries.values());
        });
    };

    // Handle Retours Update
    const handleRetourChange = <K extends keyof Retour>(index: number, field: K, value: Retour[K]) => {
        if (value === undefined || value === null) return;
        setSelectedRetours(prevRetours => {
            const updatedRetours = [...prevRetours];
            updatedRetours[index] = { ...updatedRetours[index], [field]: value };
            return updatedRetours;
        });
    };

    // Handle Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployeur) {
            setError("الرجاء اختيار الموظف.");
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
        if (!data.date) {
            setError("الرجاء إدخال تاريخ صحيح.");
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
                id_service: data.id_service,
                date: data.date,
                return_reason: data.return_reason,
                retours: selectedRetours.map(retour => ({
                    id_article: retour.idArticle,
                    quantity: retour.quantity,
                })),
            };

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours/${bonRetour_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("فشل في تحديث وصل الإرجاع.");

            fetchBonRetours();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "حدث خطأ غير معروف.");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث وصل إرجاع</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
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

                            {/* Selected Articles Table */}
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

export default UpdateBonRetourForm;