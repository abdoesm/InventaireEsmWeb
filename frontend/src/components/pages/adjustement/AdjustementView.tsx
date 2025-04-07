import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";
import { Adjustement } from "../../../models/adjustementTypes";
  // Now using the new hook
import { Article } from "../../../models/articleTypes";
import useFetchArticles from "../../../services/article/usefetchArticles";
import useFetchAdjustements from "../../../services/article/useFetchAdjustements";
import AddAdjustementForm from "./AddAdjustementForm";

const AdjustementView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedAdjustement, setSelectedAdjustement] = useState<Adjustement | null>(null);

  const { articles, loading: loadingArticles, error: articlesError  } = useFetchArticles();
  const { adjustments, loading: loadingAdjustments, error: adjustmentsError  ,fetchAdjustments} = useFetchAdjustements();  // Using the new hook

  useEffect(() => {
    // The adjustments are fetched when the component mounts
  }, [adjustments]);

  // Columns for the data table
  const columns = [
    { name: "المعرف", selector: (row: Adjustement) => row.id ?? 0, sortable: true },
    {
      name: "المقال",
      selector: (row: Adjustement) => {
        const article = articles.find((a: Article) => a.id === row.article_id);
        if (!article) {
          console.warn(`Article with ID ${row.article_id} not found.`);
          return "غير معروف";
        }
        return article.name;
      },
      sortable: true,
    },
    { name: "النوع", selector: (row: Adjustement) => row.adjustment_type ?? "غير متوفر"  },
    {
      name: "الكمية",
      selector: (row: Adjustement) => row.quantity ?? 0,
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row: Adjustement) => row.adjustment_type === "increase",
          style: {
            color: "green",
          },
        },
        {
          when: (row: Adjustement) => row.adjustment_type === "decrease",
          style: {
            color: "red",
          },
        },
      ],
    },
    { name: "تاريخ التعديل", selector: (row: Adjustement) => row.adjustment_date ?? "غير متوفر" },
    {
      name: "الإجراءات",
      cell: (row: Adjustement) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedAdjustement(item);
            setShowUpdateForm(true);
          }}
          onDelete={(item) => {
            setSelectedAdjustement(item);
            setShowDeleteForm(true);
          }}
        />
      ),
    },
  ];


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <HomeBtn />
        <h3 className="text-center">إدارة التعديلات</h3>
        <button className="btn btn-success" onClick={() => setShowAddForm(true)}>
          <FaPlus /> إضافة تعديل
        </button>
      </div>

      {loadingAdjustments || loadingArticles ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : adjustmentsError || articlesError ? (
        <p className="text-danger">{adjustmentsError || articlesError}</p>
      ) : (
        <DataTable
          columns={columns}
          data={adjustments}
          progressPending={loadingAdjustments}
          pagination
          highlightOnHover
          responsive
        />
      )}

{showAddForm && <AddAdjustementForm fetchAdjustments={fetchAdjustments}  onClose={() => setShowAddForm(false)} />}

    
    </div>
  );
};

export default AdjustementView;
