import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BonSortie } from "../../../models/bonSortieType";
import { Bk_End_SRVR } from "../../../configs/conf";
import HomeBtn from "../../common/HomeBtn";
import useArticlesAndEmployers from "../../../services/useArticlesAndEmployersAndServices";

const BonSortieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bonSortie, setBonSortie] = useState<BonSortie | null>(null);
  const [mapSorties, setMapSorties] = useState<{ id: number; id_article: number; id_bs: number; quantity: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { articles, employers, services } = useArticlesAndEmployers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bonSortieRes, sortiesRes] = await Promise.all([
          fetch(`${Bk_End_SRVR}:5000/api/bonsorties/${id}`),
          fetch(`${Bk_End_SRVR}:5000/api/bonsorties/sortie/${id}`)
        ]);

        if (!bonSortieRes.ok) throw new Error("Failed to fetch Bon de Sortie details");
        if (!sortiesRes.ok) throw new Error("Failed to fetch sorties");

        const bonSortieData: BonSortie = await bonSortieRes.json();
        const sortiesData: { id: number; id_article: number; id_bs: number; quantity: number }[] = await sortiesRes.json();

        setBonSortie(bonSortieData);
        setMapSorties(sortiesData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const employer = bonSortie ? employers.find(emp => emp.id === bonSortie.id_employeur) : null;
  const service = bonSortie ? services.find(srv => srv.id === bonSortie.id_service) : null;
  const formattedDate = bonSortie ? new Date(bonSortie.date).toLocaleDateString() : "غير معروف";
  const totalQuantity = mapSorties.reduce((sum, sortie) => sum + sortie.quantity, 0);
  const groupedQuantities = mapSorties.reduce((acc, sortie) => {
    const article = articles.find(a => a.id === sortie.id_article);
    if (!article) return acc;
    acc[article.name] = (acc[article.name] || 0) + sortie.quantity;
    return acc;
  }, {} as Record<string, number>);
  const printStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    padding: "20mm",
    pageBreakBefore: "always",
    pageBreakAfter: "always",
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mt-5" style={printStyle}>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>العودة</button>
      <button className="btn btn-primary mb-3 ms-2" onClick={handlePrint}>طباعة</button>
     
      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : bonSortie ? (
        <div className="card shadow p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <img src="/img/esm-logo.png" alt="Logo" width={70} className="mb-2" />
            <h5 className="fw-bold">الجمهورية الجزائرية الديمقراطية الشعبية</h5>
            <h6>وزارة العدل</h6>
            <h6>المدرسة العليا للقضاء</h6>
          </div>

          <h2 className="fw-bold text-center" style={{ fontFamily: "Andalus, serif", fontSize: "27px" }}>وصل إخراج</h2>

          {/* Details Section */}

          <div className="container">
          <div className="row">
          <div className="col-sm">
              <p>{bonSortie.id}</p>
              <p>{formattedDate}</p>
              <p>{employer ? `${employer.fname} ${employer.lname}` : "غير معروف"}</p>
              <p>{service ? service.name : "غير معروف"}</p>
            </div>
            <div className="col-sm fw-bold">
              <p>:رقم الوصل</p>
              <p> :التاريخ</p>
              <p>: السيد (ة)</p>
              <p>:المصلحة </p>
            </div>
            </div>
          </div>
          
          {/* Table Section */}
          {mapSorties.length > 0 ? (
            <table className="table table-striped mt-3 text-center">
              <thead className="table-dark">
                <tr>
                  <th>المعرف</th>
                  <th>العنصر</th>
                  <th>الملاحظة</th>
                  <th>الكمية</th>
                </tr>
              </thead>
              <tbody>
                {mapSorties.map((m) => {
                  const article = articles.find(a => a.id === m.id_article);
                  return (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{article ? article.name : "غير معروف"}</td>
                      <td>{article ? article.remarque : "لا توجد ملاحظة"}</td>
                      <td>{m.quantity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted">لا توجد خرجات مرتبطة بهذا الوصل.</p>
          )}

          {/* Footer Section */}
          <div className="mt-4 d-flex justify-content-between">
            <div className="text-center" style={{ width: "120px" }}>
              <p className="fw-bold" style={{ fontFamily: "Andalus, serif", fontSize: "12px" }}>أمين المخزن</p>
            </div>
            <div className="text-center" style={{ width: "120px" }}>
              <p className="fw-bold" style={{ fontFamily: "Andalus, serif", fontSize: "12px" }}>المعني</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-danger">لم يتم العثور على التفاصيل.</p>
      )}
    </div>
  );
};

export default BonSortieDetails;
