import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useEmployers from "../../../services/employers/useEmployers";
import useService from "../../../services/a_services/useServices";
import useBonSortieDetails from "../../../services/bonSorties/useBonSortieDetails";

const BonSortieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { articles } = useFetchArticles();
  const {employers} =useEmployers();
  const { services}= useService();
  let nemriqueID = parseInt(id!);

  const { bonSortie, mapSorties, loading, error } = useBonSortieDetails(nemriqueID);

  const employer = useMemo(() => bonSortie ? employers.find(emp => emp.id === bonSortie.id_employeur) : null, [bonSortie, employers]);
  const service = useMemo(() => bonSortie ? services.find(srv => srv.id === bonSortie.id_service) : null, [bonSortie, services]);
  const formattedDate = bonSortie ? new Date(bonSortie.date).toLocaleDateString() : "غير معروف";

 const handlePrint = () => {
    if (!bonSortie) {
      console.error("No BonSortie data available for printing.");
      return;
    }
  
    const formattedDate = bonSortie.date ? new Date(bonSortie.date).toISOString().split("T")[0] : "unknown";
    const fileName = `BonSortie_${bonSortie.id}_${formattedDate}.pdf`;
  
    console.log("Printing...");
  
    // Hide non-print elements
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
        // Restore non-print elements
        document.querySelectorAll(".no-print").forEach(el => el.classList.remove("d-none"));
      })
      .catch((err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error generating PDF:", errorMessage);
        document.querySelectorAll(".no-print").forEach(el => el.classList.remove("d-none"));
      });
  };
  
  

return (
  <>
  <div id="pdf-content" >
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
    ) : bonSortie ? (
      <div className="container">
        {/* Header */}
        <div className="text-center mb-4 fw-bold fs-4" style={{ fontFamily: 'andalus' }}>
          <img src="/img/esm-logo.png" alt="Logo" width={70} className="mb-2" />
          <h5 >الجمهورية الجزائرية الديمقراطية الشعبية</h5>
          <h6>وزارة العدل</h6>
          <h6>المدرسة العليا للقضاء</h6>
        </div>

        <h2 className="fw-bold text-center  fs-4"  style={{ fontFamily: 'andalus' }}>وصل إخراج</h2>

        {/* Details Section */}
        <div className="container">
          <div className="row">
            <div className="col-sm text-end fw-bold " style={{ fontFamily: 'SansSerif' }}>
              <p>{bonSortie.id}</p>
              <p>{formattedDate}</p>
              <p>{employer ? `${employer.fname} ${employer.lname}` : "غير معروف"}</p>
              <p>{service ? service.name : "غير معروف"}</p>
            </div>
            <div className="col-sm fw-bold text-end"  style={{ fontFamily: 'andalus' }}>
              <p>:رقم الوصل</p>
              <p>:التاريخ</p>
              <p>: السيد </p>
              <p>:المصلحة </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {mapSorties.length > 0 ? (
          <table className="table  table-bordered table-responsive mt-3 text-center">
            <thead>
              <tr style={{ fontFamily: 'andalus' }} >
                <th>المعرف</th>
                <th>العنصر</th>
                <th>الملاحظة</th>
                <th>الكمية</th>
              </tr>
            </thead>
            <tbody>
              {mapSorties.map(({ id, id_article, quantity }) => {
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
          <p className="text-center text-muted">لا توجد خرجات مرتبطة بهذا الوصل.</p>
        )}

        {/* Footer Section */}
        <div className="mt-4 d-flex justify-content-between" style={{ fontFamily: 'andalus' }}>
          <div className="text-center w-25">
            <p className="fw-bold andalus-font fs-5">أمين المخزن</p>
          </div>
          <div className="text-center w-25">
            <p className="fw-bold andalus-font fs-5">المعني</p>
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

export default BonSortieDetails;
