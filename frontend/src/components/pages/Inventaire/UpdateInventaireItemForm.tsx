import React, { useState, useEffect } from "react";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import SelectionList from "../../common/SelectionList";
import { Article } from "../../../models/articleTypes";
import { Employer } from "../../../models/employerType";
import { Localisation } from "../../../models/localisationType";
import useArticlesAndEmployers from "../../../services/useArticlesAndEmployersAndServices";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import { InventaireItem } from "../../../models/inventaireItemType";

interface UpdateInventaireItemFormProps {
    onClose: () => void;
    fetchInventaireItems: () => void;
    selectedItem: InventaireItem;
}


const UpdateInventaireItemForm: React.FC<UpdateInventaireItemFormProps> = ({ onClose, fetchInventaireItems, selectedItem }) => {
    console.log("selectedItem", selectedItem);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArticle, setSelectedArticle] = useState<Article | null>();
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>();
    const [selectedLocation, setSelectedLocation] = useState<Localisation | null>();
    const [status, setStatus] = useState(selectedItem?.status || "");
    const [numInventaire, setNumInventaire] = useState(selectedItem?.numInventaire || "");
    const [dateInventaire, setDateInventaire] = useState(selectedItem?.dateInventaire || "");

    const [localisations, setLocalisations] = useState<Localisation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { articles, employers } = useArticlesAndEmployers();
    const filteredArticles = articles.filter((article) =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        if (selectedItem) {
            setNumInventaire(selectedItem.numInventaire || "");
            setStatus(selectedItem.status || "");

            // Ensure proper date formatting (assuming stored format is 'yyyy-MM-dd' or an ISO string)
            const formattedDate = selectedItem.dateInventaire
                ? new Date(selectedItem.dateInventaire).toISOString().split("T")[0]
                : "";
            setDateInventaire(formattedDate);

            // Set selected article
            const foundArticle = articles.find((article) => article.id === selectedItem.idArticle);
            setSelectedArticle(foundArticle || null);

            // Set selected employer
            const foundEmployer = employers.find((employer) => employer.id === selectedItem.idEmployer);
            setSelectedEmployer(foundEmployer || null);

            // Set selected location
            const foundLocation = localisations.find((loc) => loc.id === selectedItem.idLocalisation);
            setSelectedLocation(foundLocation || null);
        }
    }, [selectedItem, articles, employers, localisations]);


    useEffect(() => {
        const fetchLocalisations = async () => {
            try {
                const response = await fetch(`${Bk_End_SRVR}:5000/api/localisations`);
                if (!response.ok) throw new Error("Failed to fetch localisations.");
                const data: Localisation[] = await response.json();
                setLocalisations(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchLocalisations();
    }, []);

    const handleUpdate = async () => {
        if (!selectedArticle || !selectedEmployer || !selectedLocation || !numInventaire || !status) {
            alert("يرجى ملء جميع الحقول المطلوبة");
            return;
        }

        try {
            await fetch(`${Bk_End_SRVR}:5000/api/inventaire/${selectedItem.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedItem.id,
                    idArticle: selectedArticle.id,
                    idUser: 1,
                    idLocalisation: selectedLocation.id,
                    idEmployer: selectedEmployer.id,
                    numInventaire: numInventaire,
                    dateInventaire: dateInventaire,
                    status: status,
                }),
            });

            alert("تم تحديث العنصر بنجاح!");
            fetchInventaireItems();
            onClose();
        } catch (error) {
            console.error("Error updating item:", error);
            alert("حدث خطأ أثناء التحديث.");
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تحديث عنصر الجرد</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        <FormGroup label="حدد المادة">
                            <SearchInput
                                placeholder="ابحث عن المادة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <SelectionList
                                items={filteredArticles as { id: number; name: string }[]} // ✅ Type casting
                                selectedItem={selectedArticle as { id: number; name: string } | null} // ✅ Ensure type consistency
                                onSelect={(article) => setSelectedArticle(article as Article)}
                                getItemLabel={(article) => article.name}
                                emptyMessage="لا توجد مقالات متاحة"
                            />
                        </FormGroup>

                        <FormGroup label="حدد الموظف المسؤول">
                            <SelectionList
                                items={employers}
                                selectedItem={selectedEmployer || null}
                                onSelect={setSelectedEmployer}
                                getItemLabel={(employer) => `${employer.fname} ${employer.lname}`}
                                emptyMessage="لا يوجد موظفون متاحون"
                            />
                        </FormGroup>

                        <Input
                            label="التاريخ"
                            type="date"
                            name="date"
                            value={dateInventaire}
                            onChange={(e) => setDateInventaire(e.target.value)}
                        />

                        <FormGroup label="رقم الجرد">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="أدخل رقم الجرد"
                                value={numInventaire}
                                onChange={(e) => setNumInventaire(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup label="حالة العنصر">
                            <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">اختر الحالة</option>
                                <option value="جديد">جديد</option>
                                <option value="مستخدم">مستخدم</option>
                                <option value="تالف">تالف</option>
                            </select>
                        </FormGroup>

                        <FormGroup label="الموقع">
                            {loading ? <p>جارٍ تحميل المواقع...</p> : error ? <p className="text-danger">{error}</p> : (
                                <SelectionList
                                    items={localisations as { id: number; loc_name: string; floor: number; id_service: number; }[]} // ✅ Uses correct type
                                    selectedItem={selectedLocation as { id: number; loc_name: string; floor: number; id_service: number; } | null} // ✅ Ensure type consistency
                                    onSelect={(location) => setSelectedLocation(location as Localisation)}
                                    getItemLabel={(location) => `${location.loc_name} الطابق ${location.floor}   `}

                                    emptyMessage="لا توجد مواقع متاحة"
                                />
                            )}
                        </FormGroup>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                        <button className="btn btn-primary" onClick={handleUpdate}>تحديث</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateInventaireItemForm;