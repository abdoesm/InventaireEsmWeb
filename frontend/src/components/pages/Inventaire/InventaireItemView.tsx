import React, { use, useEffect } from "react";

import { useState } from "react";
import HomeBtn from "../../common/HomeBtn";
import { Bk_End_SRVR } from "../../../configs/conf";
import DataTable from "react-data-table-component";
import ActionButtons from "../../common/ActionButtons";


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

      // Convert API response to match component expectations
      const mappedData = data.map((item: any) => ({
        id: item.id,
        idArticle: item.id_article,
        idUser: item.user_id,
        idLocalisation: item.id_localisation,
        idEmployer: item.id_employer,
        numInventaire: item.num_inventaire,
        dateInventaire: item.time, // Assuming 'time' represents the inventory date
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
  { name: "المعرف", selector: (row: InventaireItem) => row.id ?? 0, sortable: true },
  { name: "المعرف الخاص بالمادة", selector: (row: InventaireItem) => row.idArticle ?? 0, sortable: true },
  { name: "المعرف الخاص بالمستخدم", selector: (row: InventaireItem) => row.idUser ?? 0, sortable: true },
  { name: "المعرف الخاص بالموقع", selector: (row: InventaireItem) => row.idLocalisation ?? 0, sortable: true },
  { name: "المعرف الخاص بالموظف", selector: (row: InventaireItem) => row.idEmployer ?? 0, sortable: true },
  { name: "رقم الجرد", selector: (row: InventaireItem) => row.numInventaire ?? "", sortable: true },
  { name: "تاريخ الجرد", selector: (row: InventaireItem) => row.dateInventaire ?? "", sortable: true },
  { name: "العمليات",    cell: (row: InventaireItem) => (
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
    </div>
  );
};

export default InventaireItemView;
