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
import UpdateAdjustementForm from "./UpdateAdjustementForm";
import DeleteAdjustmentForm from "./DeleteAdjustementForm";
import HeaderContainer from "../../common/HeaderContainer";
import { Title } from "../../common/Title";
import CreateBtn from "../../common/CreateBtn";
import SearchInput from "../../common/SearchInput";

const AdjustementView: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedAdjustement, setSelectedAdjustement] = useState<Adjustement | null>(null);

  const { articles, loading: loadingArticles, error: articlesError } = useFetchArticles();
  const { adjustments, loading: loadingAdjustments, error: adjustmentsError, fetchAdjustments } = useFetchAdjustements();  // Using the new hook
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAdjustments = adjustments.filter((adjustment) =>
    adjustment.id.toString().includes(searchQuery) ||
    adjustment.adjustment_date.includes(searchQuery) ||
    adjustment.adjustment_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    articles.find(article => article.id === adjustment.article_id)?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    { name: "النوع", selector: (row: Adjustement) => row.adjustment_type ?? "غير متوفر" },
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
    <>
    <HeaderContainer>
        <HomeBtn />
        <Title name="إدارة التعديلات" />
        <SearchInput
            type="text"
            className="form-control"
            placeholder="ابحث بالاسم أو النوع او المعرف  أو التاريخ  ..."
            value={searchQuery}
            onChange={handleSearch}
          />
        <CreateBtn lunch={setShowAddForm} name="إضافة تعديل" />
        </HeaderContainer>

      {loadingAdjustments || loadingArticles ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : adjustmentsError || articlesError ? (
        <p className="text-danger">{adjustmentsError || articlesError}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredAdjustments}
          progressPending={loadingAdjustments}
          pagination
          highlightOnHover
          responsive
        />
      )}

      {showAddForm && <AddAdjustementForm fetchAdjustments={fetchAdjustments} onClose={() => setShowAddForm(false)} />}

      {showUpdateForm && selectedAdjustement && (
        <UpdateAdjustementForm
          fetchAdjustments={fetchAdjustments}
          onClose={() => setShowUpdateForm(false)}
          adjustment={selectedAdjustement}
        />
      )}

      {showDeleteForm && selectedAdjustement && (
        <DeleteAdjustmentForm
          adjustment_id={selectedAdjustement.id}
          fetchAdjustments={fetchAdjustments}
          onClose={() => setShowDeleteForm(false)}
        />
      )}


    </>
  );
};

export default AdjustementView;
