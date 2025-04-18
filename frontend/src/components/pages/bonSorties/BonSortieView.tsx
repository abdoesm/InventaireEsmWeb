import React, { useState } from "react";

import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import "bootstrap/dist/css/bootstrap.min.css";
import UpdateBonSortieForm from "./UpdateBonSortieForm";
import DeleteBonSortieForm from "./DeleteBonSortieForm";
import ActionButtons from "../../common/ActionButtons";
import AddBonSortieForm from "./AddBonSortieForm";

import HomeBtn from "../../common/HomeBtn";
import { BonSortie } from "../../../models/bonSortieType";
import { useNavigate } from "react-router-dom";

import SearchInput from "../../common/SearchInput";
import useEmployers from "../../../services/employers/useEmployers";
import useService from "../../../services/a_services/useServices";
import useBonSortie from "../../../services/bonSorties/useBonSortie";
import CreateBtn from "../../common/CreateBtn";
import { Title } from "../../common/Title";
import HeaderContainer from "../../common/HeaderContainer";




const BonSortieView: React.FC = () => {


  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddBonSortieForm, setShowAddBonSortieForm] = useState<boolean>(false);
  const [showUpdateBonSortieForm, setShowUpdateBonSortieForm] = useState<boolean>(false);
  const [selectedBonSortie, setSelectedBonSortie] = useState<BonSortie | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigate = useNavigate(); // Initialize navigation hook

  const handleRowDoubleClick = (row: BonSortie) => {
    navigate(`/bonsorties/${row.id}`); // Navigate to the details page with the BonSortie ID
  };
  const { employers } = useEmployers();
  const { services } = useService();
  const { bonSorties, error, loading, fetchBonSorties } = useBonSortie();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const filteredBonSortie = bonSorties.filter((bon) =>
    bon.id.toString().includes(searchQuery) ||
    bon.date.includes(searchQuery) ||
    bon.id_employeur.toString().includes(searchQuery) ||
    employers.find(e => e.id === bon.id_employeur)?.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employers.find(e => e.id === bon.id_employeur)?.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    services.find(s => s.id === bon.id_service)?.name.toLowerCase().includes(searchQuery.toLowerCase())


  )

  const handlePrint = (bonSortie: BonSortie) => {
    console.log("Printing:", bonSortie);
    // Implement actual print function here
  };
  const columns = [
    { name: "المعرف", selector: (row: BonSortie) => row.id, sortable: true },
    {
      name: " الموظف", selector: (row: BonSortie) => {
        const emplyer = employers.find(emp => emp.id === row.id_employeur);
        return emplyer ? emplyer.fname + " " + emplyer.lname : "غير معروف"
      }, sortable: true
    },
    {
      name: "المصلحة", selector: (row: BonSortie) => {
        const service = services.find(srv => srv.id === row.id_service);
        return service ? service.name : "غير معروفة"
      }, sortable: true
    },
    { name: "التاريخ", selector: (row: BonSortie) => row.date, sortable: true },
    {
      name: "الإجراءات",
      cell: (row: BonSortie) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedBonSortie(item);
            setShowUpdateBonSortieForm(true);
          }}
          onDelete={(item) => {
            setSelectedBonSortie(item);
            setShowDeleteForm(true);
          }}
          onPrint={handlePrint}
        />
      ),
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <HeaderContainer>
        <HomeBtn />
        <Title name="  إدارة وصول الخروج" />
        <SearchInput
          type="text"
          className="form-control"
          placeholder="ابحث برقم الوثيقة أو التاريخ أو الموظف..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <CreateBtn lunch={setShowAddBonSortieForm} name="إضافة وصل" />
      </HeaderContainer>

      {/* Search Input Field */}



      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة وصول الخروج"
          columns={columns}
          data={filteredBonSortie}
          pagination
          highlightOnHover
          responsive
          striped
          onRowDoubleClicked={handleRowDoubleClick} // Handle double-click event
        />
      )}

      {showAddBonSortieForm && (
        <AddBonSortieForm onClose={() => setShowAddBonSortieForm(false)} fetchBonSorties={fetchBonSorties} />
      )}


      {showUpdateBonSortieForm && selectedBonSortie && (
        <UpdateBonSortieForm
          onClose={() => setShowUpdateBonSortieForm(false)}
          fetchBonSorties={fetchBonSorties}
          id={selectedBonSortie.id}
        />
      )}





      {showDeleteForm && selectedBonSortie && (
        <DeleteBonSortieForm
          onClose={() => setShowDeleteForm(false)}
          bonSortieId={selectedBonSortie.id}
          fetchBonSortie={fetchBonSorties}
        />
      )}
    </>
  );
};

export default BonSortieView;
