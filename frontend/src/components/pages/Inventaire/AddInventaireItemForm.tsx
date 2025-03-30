import React, { useState, useEffect } from "react";
import FormGroup from "../../common/FormGroup";
import SearchInput from "../../common/SearchInput";
import SelectionList from "../../common/SelectionList";
import { Article } from "../../../models/articleTypes";
import { Employer } from "../../../models/employerType";
import { Localisation } from "../../../models/localisationType";
import { Bk_End_SRVR } from "../../../configs/conf";
import Input from "../../common/Input";
import { checkAuth, UserType } from "../../../App";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useEmployers from "../../../services/employers/useEmployers";

interface AddInventaireItemFormProps {
    onClose: () => void;
    fetchInventaireitem: () => void;
}

const AddInventaireItemForm: React.FC<AddInventaireItemFormProps> = ({ onClose, fetchInventaireitem }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<Localisation | null>(null);
    const [numInventaire, setNumInventaire] = useState("");
    const [status, setStatus] = useState("");
    const [user, setUser] = useState<UserType>();
    const [dateInventaire, setDateInventaire] = useState("");

    const [localisations, setLocalisations] = useState<Localisation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { articles } = useFetchArticles();
    const { employers} =useEmployers();


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

    useEffect(() => {
        const authenticatedUser = checkAuth();
        console.log("Authenticated User:", authenticatedUser);
        setUser(authenticatedUser);
    }, []);
    

    const filteredArticles = articles.filter((article) =>
        article.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateInventaire(e.target.value);
    };
    

    const handleSubmit = async () => {
        if (!selectedArticle || !selectedEmployer || !selectedLocation || !numInventaire || !status || !dateInventaire || !user) {
            alert("يرجى ملء جميع الحقول المطلوبة");
            return;
        }
           const authenticatedUser = checkAuth();
    console.log("Authenticated User:", authenticatedUser);

    if (!authenticatedUser || !authenticatedUser.id) {
        alert("حدث خطأ أثناء جلب بيانات المستخدم.");
        return;
    }
    

        console.log("User on submit:", user);
        console.log("User ID:", user?.id);
        console.log("Request Payload:", JSON.stringify({
            idArticle: selectedArticle.id,
            idUser: user?.id, 
            idLocalisation: selectedLocation.id,
            idEmployer: selectedEmployer.id,
            numInventaire: numInventaire,
            dateInventaire: dateInventaire,
            status: status
        }));
                
    
        try {
            await fetch(`${Bk_End_SRVR}:5000/api/inventaire`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idArticle: selectedArticle.id,
                    idUser: user.id, // Change this to the actual logged-in user ID
                    idLocalisation: selectedLocation.id,
                    idEmployer: selectedEmployer.id,
                    numInventaire: numInventaire,
                    dateInventaire: dateInventaire,
                    status: status
                }),
            });
    
            alert("تمت إضافة العنصر بنجاح!");
            fetchInventaireitem();
            onClose();
        } catch (error) {
            console.error("Error adding item:", error);
            alert("حدث خطأ أثناء الإضافة.");
        }
    };
    

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">إضافة عنصر جديد إلى الجرد</h5>
                        <button type="button" className="btn-close" aria-label="إغلاق" onClick={onClose}></button>
                    </div>

                    <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {/* Article Selection */}
                        <FormGroup label="حدد المادة لإضافتها">
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

                        {/* Employer Selection */}
                        <FormGroup label="حدد الموظف المسؤول">
                            <SelectionList
                                items={employers}
                                selectedItem={selectedEmployer}
                                onSelect={setSelectedEmployer}
                                getItemLabel={(employer) => employer.fname + " " + employer.lname}
                                emptyMessage="لا يوجد موظفون متاحون"
                            />
                        </FormGroup>

                        <div className="col-md-6">
                                        <Input label="التاريخ" type="date" name="date" value={dateInventaire} onChange={handleChange} />
                        </div>

                        {/* Inventory Item Number */}
                        <FormGroup label="رقم الجرد">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="أدخل رقم الجرد"
                                value={numInventaire}
                                onChange={(e) => setNumInventaire(e.target.value)}
                            />
                        </FormGroup>

                        {/* Status Selection */}
                        <FormGroup label="حالة العنصر">
                            <select
                                className="form-control"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">اختر الحالة</option>
                                <option value="جديد">جديد</option>
                                <option value="مستخدم">مستخدم</option>
                                <option value="تالف">تالف</option>
                            </select>
                        </FormGroup>

                        {/* Location Selection */}
                        <FormGroup label="الموقع">
                            {loading ? (
                                <p>جارٍ تحميل المواقع...</p>
                            ) : error ? (
                                <p className="text-danger">{error}</p>
                            ) : (
                                <SelectionList
                                    items={localisations as  { id: number; loc_name: string  ; floor: number; id_service: number;}[]} // ✅ Uses correct type
                                    selectedItem={selectedLocation as { id: number; loc_name: string  ; floor: number; id_service: number;} | null} // ✅ Ensure type consistency
                                    onSelect={(location) => setSelectedLocation(location as Localisation)}
                                    getItemLabel={(location) =>  `${ location.loc_name} الطابق ${location.floor}   `   } 
                                    emptyMessage="لا توجد مواقع متاحة"
                                />
                            )}
                        </FormGroup>


                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
                        <button className="btn btn-primary" onClick={handleSubmit}>إضافة</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInventaireItemForm;