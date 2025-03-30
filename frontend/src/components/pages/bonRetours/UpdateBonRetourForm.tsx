import React, { useState, useEffect, useMemo } from "react";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import SelectionList from "../../common/SelectionList";
import { Employer } from "../../../models/employerType";
import { Service } from "../../../models/serviceTypes";
import { Article } from "../../../models/articleTypes";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useEmployers from "../../../services/employers/useEmployers";
import useService from "../../../services/a_services/useServices";
import useBonRetourDetails from "../../../services/bonRetours/useBonRetourDetails";
import ArticleSelection from "../../common/ArticleSelection";
import { Bk_End_SRVR } from "../../../configs/conf";
import { Retour } from "../../../models/retourType";
import { BonRetour } from "../../../models/bonRetourTypes";

type Props = {
    onClose: () => void;
    fetchBonRetours: () => void;
    bonRetour_id: number;
};

const UpdateBonRetourForm: React.FC<Props> = ({ onClose, fetchBonRetours, bonRetour_id }) => {
    const { services } = useService();
    const { articles } = useFetchArticles();
    const { employers } = useEmployers();
    const { bonRetour: fetchedBonRetour, retours, error: fetchError, isLoading } = useBonRetourDetails(bonRetour_id.toString());
    
    const [bonRetour, setBonRetour] = useState<BonRetour>({ 
        id_employeur: 0, 
        id_service: 0, 
        date: "", 
        return_reason: "" 
    });
    const [selectedRetours, setSelectedRetours] = useState<Retour[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employeurSearchTerm, setEmployeurSearchTerm] = useState("");
    const [serviceSearchTerm, setServiceSearchTerm] = useState("");
    const [selectedEmployeur, setSelectedEmployeur] = useState<Employer | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Memoized filtered data
    const filteredServices = useMemo(() => 
        services.filter(service => 
            service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
        ), 
        [services, serviceSearchTerm]
    );

    const filteredArticles = useMemo(() => 
        articles.filter(article => 
            article.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [articles, searchTerm]
    );

    const filteredEmployer = useMemo(() => 
        employers.filter(employer =>
            employer.fname.toLowerCase().includes(employeurSearchTerm.toLowerCase()) ||
            employer.lname.toLowerCase().includes(employeurSearchTerm.toLowerCase())
        ),
        [employers, employeurSearchTerm]
    );

    // Initialize form data from fetched data
    useEffect(() => {
        if (fetchedBonRetour) {
            setBonRetour(fetchedBonRetour);
        }
    }, [fetchedBonRetour]);

    useEffect(() => {
        if (retours) {
            setSelectedRetours(retours.map((retour: any) => ({
                idArticle: retour.id_article,
                quantity: retour.quantity,
                id_br: retour.id_br,
            })));
        }
    }, [retours]);

    useEffect(() => {
        if (bonRetour && employers.length > 0 && services.length > 0) {
            setSelectedEmployeur(employers.find(e => e.id === bonRetour.id_employeur) || null);
            setSelectedService(services.find(s => s.id === bonRetour.id_service) || null);
        }
    }, [bonRetour, employers, services]);

    const handleEmployeurSelect = (employeur: Employer) => {
        setSelectedEmployeur(employeur);
        setBonRetour(prev => ({ ...prev, id_employeur: employeur.id }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBonRetour(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setBonRetour(prev => ({ ...prev, id_service: service.id || 0 }));
    };

    const handleArticleSelect = (article: Article) => {
        setSelectedRetours((prevRetours) => {
            const newEntries = new Map(prevRetours.map((s) => [s.idArticle, s]));
            if (newEntries.has(article.id!)) {
                newEntries.delete(article.id!);
            } else {
                newEntries.set(article.id!, {
                    idArticle: article.id!,
                    quantity: 1,
                    id_br: bonRetour_id,
                });
            }
            return Array.from(newEntries.values());
        });
    };

    const handleRetourChange = <K extends keyof Retour>(index: number, field: K, value: Retour[K]) => {
        if (value === undefined || value === null) return;
        setSelectedRetours(prevRetours => {
            const updatedRetours = [...prevRetours];
            updatedRetours[index] = { ...updatedRetours[index], [field]: value };
            return updatedRetours;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        
        if (!selectedEmployeur) {
            setSubmitError("الرجاء اختيار الموظف.");
            return;
        }
        if (!selectedService) {
            setSubmitError("الرجاء اختيار مصلحة.");
            return;
        }
        if (selectedRetours.length === 0) {
            setSubmitError("الرجاء إضافة مقالات.");
            return;
        }
        if (!bonRetour.date) {
            setSubmitError("الرجاء إدخال تاريخ صحيح.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setSubmitError("No token found. Please log in.");
                return;
            }

            const requestBody = {
                id_employeur: selectedEmployeur.id,
                id_service: selectedService.id,
                date: bonRetour.date,
                return_reason: bonRetour.return_reason,
                retours: selectedRetours.map(retour => ({
                    id_article: retour.idArticle,
                    quantity: retour.quantity,
                })),
            };

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours/${bonRetour_id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "فشل في تحديث وصل الإرجاع.");
            }

            fetchBonRetours();
            onClose();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "حدث خطأ غير معروف.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">جاري التحميل...</div>;
    }

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث وصل إرجاع</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            aria-label="إغلاق" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {(fetchError || submitError) && (
                            <div className="alert alert-danger">{fetchError || submitError}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            {/* Employee Selection */}
                            <FormGroup label="الموظف">
                                <SearchInput 
                                    placeholder="ابحث عن الموظف" 
                                    value={employeurSearchTerm} 
                                    onChange={(e) => setEmployeurSearchTerm(e.target.value)} 
                                />
                                <SelectionList 
                                    items={filteredEmployer} 
                                    selectedItem={selectedEmployeur} 
                                    onSelect={handleEmployeurSelect} 
                                    getItemLabel={(e) => `${e.fname} ${e.lname}`} 
                                    emptyMessage="لا يوجد موظفون متاحون" 
                                />
                            </FormGroup>

                            {/* Date Input */}
                            <FormGroup label="التاريخ">
                                <Input 
                                    type="date" 
                                    name="date" 
                                    value={bonRetour.date} 
                                    onChange={handleChange} 
                               
                                />
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
                                    getItemLabel={(s) => s.name} 
                                    emptyMessage="لا يوجد مصالح متاحة" 
                                />
                            </FormGroup>

                            {/* Return Reason */}
                            <FormGroup label="سبب الإرجاع">
                                <Input
                                    type="text"
                                    name="return_reason"
                                    value={bonRetour.return_reason}
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
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "جاري التحديث..." : "تحديث"}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBonRetourForm;