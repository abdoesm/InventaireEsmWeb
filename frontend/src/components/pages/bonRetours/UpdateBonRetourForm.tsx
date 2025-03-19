import React, { useState, useEffect } from "react";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import SelectedArticlesTable from "../../common/SelectedArticlesTable";
import useArticlesAndFournisseurs from "../../../services/useArticlesAndFournisseurs";
import { Fournisseur } from "../../../models/fournisseurTypes";
import { Retour } from "../../../models/retourType";
import SelectionList from "../../common/SelectionList";

type Props = {
    onClose: () => void;
    fetchBonRetours: () => void;
    bonRetour_id: number;
};

const UpdateBonRetourForm: React.FC<Props> = ({ onClose, fetchBonRetours, bonRetour_id }) => {
    const [data, setData] = useState({
        id_fournisseur: 0,
        date: "",
        document_num: "",
    });

    const [selectedRetours, setSelectedRetours] = useState<Retour[]>([]);
    const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null);
      const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    const { articles, fournisseurs, error: fetchError } = useArticlesAndFournisseurs();

    // Fetch bonRetour details when component mounts
    useEffect(() => {
        const fetchBonRetour = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours/${bonRetour_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("فشل في تحميل بيانات وصل الإرجاع.");

                const bonRetour = await response.json();
                
                // Set the fetched data
                setData({
                    id_fournisseur: bonRetour.id_fournisseur,
                    date: bonRetour.date,
                    document_num: bonRetour.document_num,
                });

                setSelectedRetours(bonRetour.retours || []);
                const fournisseur = fournisseurs.find(f => f.id === bonRetour.id_fournisseur);
                setSelectedFournisseur(fournisseur || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
            } finally {
                setLoading(false);
            }
        };

        fetchBonRetour();
    }, [bonRetour_id, fournisseurs]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFournisseurSelect = (fournisseur: Fournisseur) => {
        setSelectedFournisseur(fournisseur);
        setData((prevData) => ({ ...prevData, id_fournisseur: fournisseur.id }));
    };

    const handleRetourChange = <K extends keyof Retour>(index: number, field: K, value: Retour[K]) => {
        setSelectedRetours((prevRetours) => {
            const updatedRetours = [...prevRetours];
            updatedRetours[index] = { ...updatedRetours[index], [field]: value };
            return updatedRetours;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFournisseur) {
            setError("الرجاء اختيار مورد.");
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

            const response = await fetch(`${Bk_End_SRVR}:5000/api/bonretours/${bonRetour_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    retours: selectedRetours,
                }),
            });

            if (!response.ok) throw new Error("فشل في تحديث وصل الإرجاع.");

            fetchBonRetours();
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
                        <h5 className="modal-title">تحديث وصل إرجاع</h5>
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
                                <FormGroup label="المورد">
                                    <SearchInput onChange={(e) => setSearchTerm(e.target.value)} placeholder="ابحث عن المورد..." value={selectedFournisseur?.name || ""}  />
                                    <SelectionList items={fournisseurs} selectedItem={selectedFournisseur} onSelect={handleFournisseurSelect} getItemLabel={(f) => f.name} emptyMessage="لا يوجد موردون متاحون" />
                                </FormGroup>
                                <SelectedArticlesTable<Retour> selectedItems={selectedRetours} articles={articles} onItemChange={handleRetourChange} />
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

export default UpdateBonRetourForm;
