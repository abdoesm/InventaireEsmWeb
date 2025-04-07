import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import AddLocalisationForm from "./AddLocalisationForm";
import UpdateLocalisationForm from "./UpdateLocalisationForm";
import DeleteLocalisationForm from "./DeleteLocalisationForm";

import "bootstrap/dist/css/bootstrap.min.css";
import { Localisation } from "../../../models/localisationType";
import ActionButtons from "../../common/ActionButtons";
import HomeBtn from "../../common/HomeBtn";
import useLocation from "../../../services/localisations/useLocation";
import useService from "../../../services/a_services/useServices";
import CreateBtn from "../../common/CreateBtn";
import { Title } from "../../common/Title";
import HeaderContainer from "../../common/HeaderContainer";

const LocalisationsView: React.FC = () => {


  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [selectedLocalisation, setSelectedLocalisation] = useState<Localisation | null>(null);
  const {localisations,loading,error,fetchLocalisations}=  useLocation();
  const {services}= useService();




  const columns: TableColumn<Localisation>[] = [
    {
      name: "المعرف",
      selector: (row: Localisation) => row.id ?? 0,
      sortable: true,
    },
    {
      name: "اسم الموقع",
      selector: (row: Localisation) => row.loc_name ?? "غير متوفر",
      sortable: true,
    },
    {
      name: "رقم الطابق",
      selector: (row: Localisation) => row.floor ?? 0,
      sortable: true,
    },
    {
      name: "المصلحة",
      selector: (row: Localisation) => {
        const service = services.find((s) => s.id === row.id_service);
        return service ? service.name : "غير متوفر";
      },
      sortable: true,
    },
    {
      name: "الإجراءات",
      cell: (row: Localisation) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedLocalisation(item);
            setShowUpdateForm(true);
          }}
          onDelete={(item) => {
            setSelectedLocalisation(item);
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
      <HomeBtn/>
        <Title  name="إدارة المواقع" />
                            <CreateBtn lunch={setShowAddForm} name="إضافة موقع" />
      </HeaderContainer>

      {loading ? (
        <p className="text-center text-secondary">جارٍ تحميل البيانات...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <DataTable
          title="قائمة المواقع"
          columns={columns}
          data={localisations}
          pagination
          highlightOnHover
          responsive
          striped
        />
      )}

  
      {showAddForm && <AddLocalisationForm onClose={() => setShowAddForm(false)} fetchLocalisations={fetchLocalisations} />}
      {showUpdateForm && selectedLocalisation && (
        <UpdateLocalisationForm
          onClose={() => setShowUpdateForm(false)}
          localisation={selectedLocalisation}
          fetchLocalisations={fetchLocalisations}
        />
      )}
      {showDeleteForm && selectedLocalisation && (
        <DeleteLocalisationForm
          onClose={() => setShowDeleteForm(false)}
          localisation={selectedLocalisation}
          fetchLocalisations={fetchLocalisations}
        />
      )}
    </>
  );
};

export default LocalisationsView;