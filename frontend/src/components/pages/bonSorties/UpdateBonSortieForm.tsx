import React, { useEffect, useState } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import ArticleSelection from "../../common/ArticleSelection";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import SelectionList from "../../common/SelectionList";
import useEmployers from "../../../services/employers/useEmployers";
import useService from "../../../services/a_services/useServices";
import useFetchArticles from "../../../services/article/usefetchArticles";

import { Employer } from "../../../models/employerType";
import { Service } from "../../../models/serviceTypes";
import { Sortie } from "../../../models/sortieType";
import useBonSortieDetails from "../../../services/bonSorties/useBonSortieDetails";
import { Article } from "../../../models/articleTypes";
import { BonSortie } from "../../../models/bonSortieType";

type Props = {
    id: number;
    onClose: () => void;
    fetchBonSorties: () => void;
};
const UpdateBonSortieForm : React.FC<Props>= ({ id, onClose, fetchBonSorties }) => {
    const { bonSortie, mapSorties, loading, error } = useBonSortieDetails(id);
    const { articles } = useFetchArticles();
    const { employers } = useEmployers();
    const { services } = useService();
 const [, setBonSortie] = useState<BonSortie>({ id: 0, id_employeur: 0, id_service: 0, date: "" });
    const [selectedSorties, setSelectedSorties] = useState<Sortie[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employerSearchTerm, setEmployerSearchTerm] = useState("");
    const [serviceSearchTerm, setServiceSearchTerm] = useState("");
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const filteredEmployers = employers.filter(employer =>
        employer.fname.toLowerCase().includes(employerSearchTerm.toLowerCase()) ||
        employer.lname.toLowerCase().includes(employerSearchTerm.toLowerCase())
    );
    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
    );
    const filteredArticles = articles.filter(article =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  useEffect(() => {
    try
        {
        if (bonSortie) {
            setBonSortie({
                id: bonSortie.id,
                date: bonSortie.date.split("T")[0],
                id_employeur: bonSortie.id_employeur,
                id_service: bonSortie.id_service,
            });

            setSelectedSorties(mapSorties.map((sortie: any) => ({
                idArticle: sortie.id_article,
                quantity: sortie.quantity,
                idBs: sortie.id_bs,
            })));
            setSelectedEmployer(employers.find((emp) => emp.id === bonSortie.id_employeur) || null);
            setSelectedService(services.find((serv) => serv.id === bonSortie.id_service) || null); 
        }
    }catch (error) {
        console.error("Error setting bonSortie:", error);
    }   
 } , [bonSortie, employers, mapSorties, services]);


    const handleEmployerSelect = (employer: Employer) => setSelectedEmployer(employer);
    const handleServiceSelect = (service: Service) => setSelectedService(service);

    const handleArticleSelect = (article :Article) => {
        setSelectedSorties(prevSorties => {
            const newEntries = new Map(prevSorties.map(s => [s.idArticle, s]));
            newEntries.has(article.id!) ? newEntries.delete(article.id!) :
                newEntries.set(article.id!, { idArticle: article.id!, quantity: 1, idBs: parseInt(id) });
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found. Please log in.");

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonsorties/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    ...bonSortie,
                    sorties: selectedSorties,
                }),
            });

            if (!response.ok) throw new Error("Failed to update Bon Sortie.");
            fetchBonSorties();
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث وصل خروج</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {loading ? <p>جارٍ تحميل البيانات...</p> : error ? <p className="text-danger">{error}</p> : (
                            <form onSubmit={handleSubmit}>
                                <FormGroup label="التاريخ">
                                    <input type="date" name="date" value={bonSortie?.date.split("T")[0] || ""} readOnly />
                                </FormGroup>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <FormGroup label="الموظف">
                                            <SearchInput value={employerSearchTerm} onChange={e => setEmployerSearchTerm(e.target.value)} />
                                            <SelectionList items={filteredEmployers} 
                                            selectedItem={selectedEmployer}
                                             onSelect={handleEmployerSelect }
                                               getItemLabel={(employer) => `${employer.fname} ${employer.lname}`}
                                                emptyMessage="لا يوجد موظفون متاحون"
                                              />
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup label="المصلحة">
                                            <SearchInput value={serviceSearchTerm} onChange={e => setServiceSearchTerm(e.target.value)} />
                                            <SelectionList items={services} 
                                            selectedItem={selectedService}
                                             onSelect={handleServiceSelect} 
                                                getItemLabel={(service) => service.name}
                                                emptyMessage="لا يوجد مصالح متاحون"
                                              />
                                        </FormGroup>
                                    </div>
                                </div>
                                <FormGroup label="حدد المقالات للخروج">
                                    <SearchInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                    <ArticleSelection articles={articles} selectedEntrees={selectedSorties} onArticleSelect={handleArticleSelect} />
                                </FormGroup>
                                <SelectedArticlesTable<Sortie>
                                 selectedItems={selectedSorties}
                                  articles={articles} 
                                  onItemChange={handleSortieChange}
                                  />
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">تحديث</button>
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

export default UpdateBonSortieForm;