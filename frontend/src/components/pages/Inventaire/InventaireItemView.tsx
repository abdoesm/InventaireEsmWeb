import React, { useEffect } from "react";

import { useState } from "react";
import HomeBtn from "../../common/HomeBtn";
import { Bk_End_SRVR } from "../../../configs/conf";
import DataTable from "react-data-table-component";
import ActionButtons from "../../common/ActionButtons";
import AddInventaireItemForm from "./AddInventaireItemForm";
import UpdateInventaireItemForm from "./UpdateInventaireItemForm";
import DeleteInventaireItem from "./DeleteInventaireItem";
import UpdateBonEntreeForm from "./UpdateInventaireItemForm";
import { InventaireItem } from "../../../models/inventaireItemType";


const InventaireItemView: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const [showAddInventaireItemForm, setShowAddInventaireItemForm] = useState<boolean>(false);
  const [showUpdateInventaireItemForm, setShowUpdateInventaireItemForm] = useState<boolean>(false);
  const [selectedInventaireItem, setSelectedInventaireItem] = useState<InventaireItem | null>(null);
  const [inventaireItems, setInventaireItems] = useState<InventaireItem[]>([]);
  const fetchInventaireItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${Bk_End_SRVR}:5000/api/inventaire`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch inventaire item.");

      const data = await response.json();
      console.log("data",data);
      const mappedData = data.map((item: any) => ({
        id: item.id,
        idArticle: item.id_article,  // Corrected
        idUser: item.user_id,  // Corrected
        idLocalisation: item.id_localisation,  // Corrected
        idEmployer: item.id_employer,  // Corrected
        numInventaire: item.num_inventaire,  // Corrected
        dateInventaire: item.time,  // Corrected
        status: item.status,  // Corrected
      }));
      
      
      setInventaireItems(mappedData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchInventaireItems();
  }, []);
 
const columns = [ 
  { name: "رقم المعرف", selector: (row: InventaireItem) => row.id ?? 0, sortable: true },
  { name: "معرف المادة", selector: (row: InventaireItem) => row.idArticle ?? 0, sortable: true },
  { name: "معرف المستخدم", selector: (row: InventaireItem) => row.idUser ?? 0, sortable: true },
  { name: "معرف الموقع", selector: (row: InventaireItem) => row.idLocalisation ?? 0, sortable: true },
  { name: "معرف الموظف", selector: (row: InventaireItem) => row.idEmployer ?? 0, sortable: true },
  { name: "رقم الجرد", selector: (row: InventaireItem) => row.numInventaire ?? "", sortable: true },
  { name: "تاريخ الجرد", selector: (row: InventaireItem) => row.dateInventaire ?? "", sortable: true },
  
  { name: "الإجراءات",    cell: (row: InventaireItem) => (
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
    <div className="container mt-5">
      <HomeBtn />
      <h2 className="fw-bold text-center">إدارة الجرد</h2>
      <button className="btn btn-success " onClick={() => setShowAddInventaireItemForm(true)}>
        إضافة جرد جديد
      </button>
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
        />
      )}

{showAddInventaireItemForm && (
  <AddInventaireItemForm onClose={() => setShowAddInventaireItemForm(false)} fetchInventaireitem={fetchInventaireItems} />
)}


{showAddInventaireItemForm && selectedInventaireItem && selectedInventaireItem.id !== undefined && (
  <AddInventaireItemForm
    onClose={() => setShowAddInventaireItemForm(false)}
    fetchInventaireitem={fetchInventaireItems}
   
  />
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
        onClose={()=> setShowDeleteForm(false)}

        InventaireItemId={selectedInventaireItem.id ?? 0}
        fetchInventaireItems={fetchInventaireItems}
        />
      )}
    </div>
  );
};

export default InventaireItemView;
