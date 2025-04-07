import React, {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";

import AddBonEntreeForm from "./AddBonEntreeForm";
import UpdateBonEntreeForm from "./UpdateBonEntreeForm";
import ActionButtons from "../../common/ActionButtons";
import DeleteBonEntreeForm from "./DeleteBonEntreeForm";

import HomeBtn from "../../common/HomeBtn";
import { BonEntree } from "../../../models/BonEntreeTypes";
import useFornisseurs from "../../../services/fornisseurs/useFornisseurs";
import SearchInput from "../../common/SearchInput";
import useBonEntree from "../../../services/bonEntrees/useBonEntree";
import CreateBtn from "../../common/CreateBtn";
import { Title } from "../../common/Title";
import HeaderContainer from "../../common/HeaderContainer";



const BonEntreeView: React.FC = () => {
  const navigate = useNavigate();

  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddBonEntreeForm, setShowAddBonEntreeForm] = useState<boolean>(false);
  const [showUpdateBonEntreeForm, setShowUpdateBonEntreeForm] = useState<boolean>(false);
  const [selectedBonEntree, setSelectedBonEntree] = useState<BonEntree | null>(null);

  const { fournisseurs } = useFornisseurs()
  const { bonEntrees, error, loading, fetchBonEntrees } = useBonEntree();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBonEntrees = bonEntrees.filter((bon) =>
    bon.id.toString().includes(searchQuery) ||
    bon.document_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bon.date.includes(searchQuery) ||
    bon.id_fournisseur.toString().includes(searchQuery) ||
    fournisseurs.find(f => f.id === bon.id_fournisseur)?.name.toLowerCase().includes(searchQuery.toLowerCase())

  );

  const handleRowDoubleClick = (row: BonEntree) => {
    navigate(`/bonentree/${row.id}`);
  };


  const columns = [
    { name: "المعرف", selector: (row: BonEntree) => row.id, sortable: true },
    {
      name: "رقم المورد", selector: (row: BonEntree) => {
        const fournisseur = fournisseurs.find(frn => frn.id === row.id_fournisseur);
        return fournisseur ? fournisseur.name : " غير معروف"
      }, sortable: true
    },
    { name: "التاريخ", selector: (row: BonEntree) => row.date, sortable: true },
    { name: "رقم الوثيقة", selector: (row: BonEntree) => row.document_num },
    {

      name: "الإجراءات",
      cell: (row: BonEntree) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedBonEntree(item);
            setShowUpdateBonEntreeForm(true);
          }}
          onDelete={(item) => {
            setSelectedBonEntree(item);
            setShowDeleteForm(true);
          }}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
   
      <HeaderContainer>
      <HomeBtn />
      <Title name="إدارة وصول الاستلام" />
          <SearchInput
            type="text"
            className="form-control"
            placeholder="ابحث برقم الوثيقة أو التاريخ أو المورد..."
            value={searchQuery}
            onChange={handleSearch}
          />
      <CreateBtn lunch={setShowAddBonEntreeForm} name="إضافة وصل استلام" />
    </HeaderContainer>

      {/* Table or Loading/Error Message */}
      {loading ? (
        <p className="text-center text-secondary fs-5">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-center text-danger fw-bold">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredBonEntrees}
          pagination
          highlightOnHover
          responsive
          striped
          onRowDoubleClicked={handleRowDoubleClick}
        />
      )}

      {/* Modals or Forms */}
      {showAddBonEntreeForm && (
        <AddBonEntreeForm
          onClose={() => setShowAddBonEntreeForm(false)}
          fetchBonEntrees={fetchBonEntrees}
        />
      )}

      {showUpdateBonEntreeForm && selectedBonEntree && (
        <UpdateBonEntreeForm
          onClose={() => setShowUpdateBonEntreeForm(false)}
          fetchBonEntrees={fetchBonEntrees}
          id={selectedBonEntree.id.toString()}
        />
      )}

      {showDeleteForm && selectedBonEntree && (
        <DeleteBonEntreeForm
          onClose={() => setShowDeleteForm(false)}
          bonEntreeid={selectedBonEntree.id}
          fetchBonEntree={fetchBonEntrees}
        />
      )}
    </>
  );

};

export default BonEntreeView;
