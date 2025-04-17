import React, { useEffect } from "react";

import { useState } from "react";
import HomeBtn from "../../common/HomeBtn";
import DataTable from "react-data-table-component";
import ActionButtons from "../../common/ActionButtons";
import AddInventaireItemForm from "./AddInventaireItemForm";
import UpdateInventaireItemForm from "./UpdateInventaireItemForm";
import DeleteInventaireItem from "./DeleteInventaireItem";
import { InventaireItem } from "../../../models/inventaireItemType";

import useLocation from "../../../services/localisations/useLocation";
import { checkAuth, UserType } from "../../../App";
import useFetchUsers from "../../../services/user/useFetchUsers";
import useInventaireItems from "../../../services/Inventaire/useInventaireItem";
import useEmployers from "../../../services/employers/useEmployers";
import useFetchArticles from "../../../services/article/usefetchArticles";
import CreateBtn from "../../common/CreateBtn";
import { Title } from "../../common/Title";
import HeaderContainer from "../../common/HeaderContainer";
import { useNavigate } from "react-router-dom";

const InventaireItemView: React.FC = () => {
  const navigate = useNavigate();

  const [, setUser] = useState<UserType>();
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddInventaireItemForm, setShowAddInventaireItemForm] = useState<boolean>(false);
  const [showUpdateInventaireItemForm, setShowUpdateInventaireItemForm] = useState<boolean>(false);
  const [selectedInventaireItem, setSelectedInventaireItem] = useState<InventaireItem | null>(null);
  const { users } = useFetchUsers();
  const { employers} = useEmployers();
  const { articles } =useFetchArticles();
  const { localisations } = useLocation();
const { inventaireItems, loading, error, fetchInventaireItems } =useInventaireItems()
  useEffect(() => {
    setUser(checkAuth());
  }, []);

   const handleRowDoubleClick = (row: InventaireItem) => {
      navigate(`/inventaire/${row.id}`);
    };
  

  const columns = [
    { name: " المعرف", selector: (row: InventaireItem) => row.id ?? 0, sortable: true },

    {
      name: "العنصر",
      selector: (row: InventaireItem) => {
        const article = articles.find((art) => art.id === row.idArticle);
        return article ? article.name : "غير معروف";
      },
      sortable: true,
      minWidth: "400px",
      maxWidth: "520px",
    },


    { name: "معرف المستخدم", selector: (row: InventaireItem) => {
      const user = users.find(usr => usr.id === row.idUser);
      return user ? user.username : "غير معروف"
    }, sortable: true },
    {
      name: "معرف الموقع", selector: (row: InventaireItem) => {
        const local = localisations.find(loc => loc.id === row.idLocalisation);
        return local ? local.loc_name + " الطابق " + local.floor : "غير معروف"
      }, sortable: true
    },
    {
      name: " الموظف", selector: (row: InventaireItem) => {
        const emplyer = employers.find(emp => emp.id === row.idEmployer);
        return emplyer ? emplyer.fname + " " + emplyer.lname : "غير معروف"
      }, sortable: true
    },
    { name: "رقم الجرد", selector: (row: InventaireItem) => row.numInventaire ?? "", sortable: true }
    ,
    { name: "تاريخ الجرد", selector: (row: InventaireItem) => row.dateInventaire ?? "", sortable: true },

    {
      name: "الإجراءات", cell: (row: InventaireItem) => (
        <ActionButtons
          item={row}
          onEdit={(item) => {
            setSelectedInventaireItem(item);
            setShowUpdateInventaireItemForm(true);
          }}
          onDelete={(item) => {
            setSelectedInventaireItem(item);
            setShowDeleteForm(true);
          }}

        />
      ),
      ignoreRowClick: true,
    },];


  return (
    <>
    <HeaderContainer>
      <HomeBtn />
      <Title name="إدارة الجرد" />

      <CreateBtn lunch={setShowAddInventaireItemForm} name="إضافة جرد" />
      </HeaderContainer>
      {loading ? (
        <p className="text-center mt-5">جار التحميل...</p>
      ) : error ? (
        <p className="text-center text-danger mt-5">{error}</p>
      ) : (
        <DataTable
          title="الجرد"
          columns={columns}
          data={inventaireItems}
          pagination
          highlightOnHover
          responsive
          striped
          onRowDoubleClicked={handleRowDoubleClick}
        />
      )}

      {showAddInventaireItemForm && (
        <AddInventaireItemForm onClose={() => setShowAddInventaireItemForm(false)} fetchInventaireitem={fetchInventaireItems} />
      )}


      {showUpdateInventaireItemForm && selectedInventaireItem && (
        <UpdateInventaireItemForm
          onClose={() => setShowUpdateInventaireItemForm(false)}
          fetchInventaireItems={fetchInventaireItems}
          selectedItem={selectedInventaireItem} // ✅ Pass selected item
        />
      )}



      {showDeleteForm && selectedInventaireItem && (
        <DeleteInventaireItem
          onClose={() => setShowDeleteForm(false)}
          InventaireItemId={selectedInventaireItem.id ?? 0}
          fetchInventaireItems={fetchInventaireItems}
        />
      )}
    </>
  );
};

export default InventaireItemView;
