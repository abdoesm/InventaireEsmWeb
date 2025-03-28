import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BonEntree } from "../../../models/BonEntreeTypes";
import { Bk_End_SRVR } from "../../../configs/conf";
import useArticlesAndEmployers from "../../../services/useArticlesAndEmployersAndServices";
import html2pdf from "html2pdf.js";

const BonEntreeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bonEntree, setBonEntree] = useState<BonEntree | null>(null);
  const [mapEntrees, setMapEntrees] = useState<{ id: number; id_article: number; id_be: number; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { articles, employers } = useArticlesAndEmployers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bonEntreeRes, entreesRes] = await Promise.all([
          fetch(`${Bk_End_SRVR}:5000/api/bonentrees/${id}`),
          fetch(`${Bk_End_SRVR}:5000/api/bonentrees/entree/${id}`),
        ]);

        if (!bonEntreeRes.ok) throw new Error("Failed to fetch Bon d'Entrée details");
        if (!entreesRes.ok) throw new Error("Failed to fetch entrees");

        setBonEntree(await bonEntreeRes.json());
        setMapEntrees(await entreesRes.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fournisseur = useMemo(() => bonEntree ? employers.find(emp => emp.id === bonEntree.id_fournisseur) : null, [bonEntree, employers]);

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

  return (
    <div id="pdf-content" className="container mt-5">
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
                <p>{fournisseur ? `${fournisseur.fname} ${fournisseur.lname}` : "غير معروف"}</p>
              </div>
              <div className="col-sm fw-bold text-end"   style={{ fontFamily: 'andalus' }} >
                <p>:رقم الوصل</p>
                <p>:التاريخ</p>
                <p>: السيد </p>
    
              </div>
            </div>
          </div>

          {mapEntrees.length > 0 ? (
            <table className="table table-bordered table-responsive mt-3 text-center">
              <thead>
                <tr style={{ fontFamily: 'andalus' }}>
                  <th>المعرف</th>
                  <th>العنصر</th>
                  <th>الملاحظة</th>
                  <th>الكمية</th>
                </tr>
              </thead>
              <tbody>
                {mapEntrees.map(({ id, id_article, quantity }) => {
                  const article = articles.find(a => a.id === id_article);
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{article?.name || "غير معروف"}</td>
                      <td>{article?.remarque || ""}</td>
                      <td>{quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted">لا توجد إدخالات مرتبطة بهذا الوصل.</p>
          )}

          <div className="mt-4 d-flex justify-content-between"  style={{ fontFamily: 'andalus' }}>
            <div className="text-center w-25">
              <p className="fw-bold fs-5">أمين المخزن</p>
            </div>
            <div className="text-center w-25">
              <p className="fw-bold fs-5">المعني</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-danger">لم يتم العثور على التفاصيل.</p>
      )}
    </div>
  );
};

export default BonEntreeDetails;