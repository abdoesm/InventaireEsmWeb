import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BonEntree } from "../../../models/BonEntreeTypes";
import { Bk_End_SRVR } from "../../../configs/conf";
import html2pdf from "html2pdf.js";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useFornisseurs from "../../../services/fornisseurs/useFornisseurs";


const BonEntreeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bonEntree, setBonEntree] = useState<BonEntree | null>(null);
  const [mapEntrees, setMapEntrees] = useState<{ id: number; id_article: number; id_be: number; quantity: number; unit_price: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { articles } = useFetchArticles();
  const {fournisseurs} =useFornisseurs()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bonEntreeRes, entreesRes] = await Promise.all([
          fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`),
          fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${id}`)
        ]);
  
        if (!bonEntreeRes.ok || !entreesRes.ok) {
          throw new Error("Failed to fetch data.");
        }
  
        const bonEntreeData = await bonEntreeRes.json();
        const entreesData = await entreesRes.json();
  
        setBonEntree(bonEntreeData);
        setMapEntrees(entreesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  const fournisseur = useMemo(() => bonEntree ? fournisseurs.find(fr => fr.id === bonEntree.id_fournisseur) : null, [bonEntree, fournisseurs]);

  const formattedDate = bonEntree ? new Date(bonEntree.date).toLocaleDateString() : "غير معروف";

  const handlePrint = () => {
    if (!bonEntree) {
      console.error("No BonEntree data available for printing.");
      return;
    }

    const formattedDate = bonEntree.date ? new Date(bonEntree.date).toISOString().split("T")[0] : "unknown";
    const fileName = `BonEntree_${bonEntree.id}_${formattedDate}.pdf`;

    console.log("Printing...");

    document.querySelectorAll(".no-print").forEach(el => el.classList.add("d-none"));

    html2pdf()
      .from(document.getElementById("pdf-content"))
      .set({
        margin: 10,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .then(() => {
        document.querySelectorAll(".no-print").forEach(el => el.classList.remove("d-none"));
      })
      .catch((err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error generating PDF:", errorMessage);
        document.querySelectorAll(".no-print").forEach(el => el.classList.remove("d-none"));
      });
  };
  const totalPrixHT = useMemo(
    () => mapEntrees.reduce((sum, entry) => sum + entry.unit_price * entry.quantity, 0),
    [mapEntrees]
  );
  
  const tva_amount = useMemo(() => totalPrixHT * 0.19, [totalPrixHT]);
  const totalValue = useMemo(() => totalPrixHT + tva_amount, [totalPrixHT, tva_amount]);
  


  return (
    <>
    <div id="pdf-content"  >
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
      ) : bonEntree ? (
        <div className="container">
          <div className="text-center mb-4 fw-bold fs-4" style={{ fontFamily: 'andalus' }}>
            <img src="/img/esm-logo.png" alt="Logo" width={70} className="mb-2" />
            <h5>الجمهورية الجزائرية الديمقراطية الشعبية</h5>
            <h6>وزارة العدل</h6>
            <h6>المدرسة العليا للقضاء</h6>
          </div>

          <h2 className="fw-bold text-center fs-4" style={{ fontFamily: 'andalus' }}>وصل إدخال</h2>

          <div className="container">
            <div className="row">
              <div className="col-sm text-end fw-bold">
                <p>{bonEntree.id}</p>
                <p>{formattedDate}</p>
                <p>{fournisseur ? `${fournisseur.name} ` : "غير معروف"}</p>
                <p>{bonEntree.document_num}</p>
              </div>
              <div className="col-sm fw-bold text-end" style={{ fontFamily: 'andalus' }} >
                <p>:رقم الوصل</p>
                <p>:القليعة، في</p>
                <p>: المورد </p>
              <p> رقم الفاتورة</p> 
              </div>
            </div>
          </div>

          {mapEntrees.length > 0 ? (
            <table className="table table-bordered table-responsive mt-3 text-center">
              <thead>
                <tr style={{ fontFamily: 'andalus' }}>
                  <th>المعرف</th>
                  <th>العنصر</th>
                  <th>الكمية</th>
                  <th>سعر الوحدة (U/HT)</th>
                  <th> المبلغ</th>


                </tr>
              </thead>
              <tbody>
                {mapEntrees.map(({ id, id_article, quantity,unit_price }) => {
                  const article = articles.find(a => a.id === id_article);
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{article?.name || "غير معروف"}</td>
                      <td>{quantity}</td>
                      <td> {unit_price}</td>
                      <td> {(unit_price *quantity).toFixed(2) }</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ fontFamily: 'andalus', fontWeight: 'bold' }}>
                  <td colSpan={4}>المجموع</td>
                  <td>{totalPrixHT.toFixed(2)}</td>
                </tr>
                <tr style={{ fontFamily: 'andalus', fontWeight: 'bold' }}>
                  <td colSpan={4}>	مبلغ الرسم على القيمة المضافة </td>
                  <td>{tva_amount.toFixed(2)}</td>
                </tr>
                <tr style={{ fontFamily: 'andalus', fontWeight: 'bold' }}>
                  <td colSpan={4}>إجمالي القيمة</td>
                  <td>{totalValue.toFixed(2)}</td>
                </tr>

              </tfoot>
            </table>
          ) : (
            <p className="text-center text-muted">لا توجد إدخالات مرتبطة بهذا الوصل.</p>
          )}

          <div className="mt-4 d-flex justify-content-between" style={{ fontFamily: 'andalus' }}>
            <div className="text-center w-25">
              <p className="fw-bold fs-5">أمين المخزن</p>
            </div>
          
          </div>
        </div>
      ) : (
        <p className="text-center text-danger">لم يتم العثور على التفاصيل.</p>
      )}
      </div>
    </>
  );
};

export default BonEntreeDetails;