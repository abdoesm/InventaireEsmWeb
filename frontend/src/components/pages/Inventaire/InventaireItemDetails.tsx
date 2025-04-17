import { useNavigate, useParams } from "react-router-dom";
import useInventaireItemDetails from "../../../services/Inventaire/useInventaireItemDetails";
import Barcode from "react-barcode"; // ⬅️ import here

const InventaireItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { item, loading, error } = useInventaireItemDetails(id || "0");
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print(); // ✅ trigger print
    };

    return (
        <>
            <div id="pdf-content">
                <style>{`
                    @media print {
                        .no-print { display: none !important; }
                    }
                `}</style>

                <div className="d-flex gap-2 mb-3">
                    <button className="btn btn-secondary no-print" onClick={() => navigate(-1)}>العودة</button>
                    <button className="btn btn-primary no-print" onClick={handlePrint}>طباعة</button>
                </div>

                {loading ? (
                    <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
                ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                ) : item ? (
                    <div className="container">
                        <h2 className="fw-bold text-center fs-4" style={{ fontFamily: 'andalus' }}>تفاصيل الجرد</h2>

                        <div className="container">
                            <div className="row">
                                <div className="col-sm text-end fw-bold" style={{ fontFamily: 'SansSerif' }}>
                                    <p>{item.id}</p>
                                    <p>{item.idArticle}</p>
                                    <p>{item.dateInventaire}</p>
                                    <p>{item.idEmployer}</p>
                                    <p>{item.numInventaire}</p>
                                    <p>{item.status}</p>
                                    <p>{item.idLocalisation}</p>
                                    <p>{item.numInventaire}</p>
                                </div>
                                <div className="col-sm fw-bold text-end" style={{ fontFamily: 'andalus' }}>
                                    <p>:رقم الجرد</p>
                                    <p>:اسم العنصر</p>
                                    <p>:التاريخ</p>
                                    <p>: الموظف </p>
                                    <p>:رقم الجرد </p>
                                    <p>:حالة الجرد </p>
                                    <p>:الموقع</p>
                                    <p>:الكود بار</p>
                                </div>
                            </div>

                            {/* ⬇️ Barcode Section */}
                            <div className="text-center mt-4">
                                <Barcode value={item.numInventaire || "00000000"} />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default InventaireItemDetails;
