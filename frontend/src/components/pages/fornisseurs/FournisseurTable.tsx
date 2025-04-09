import DataTable from "react-data-table-component";
import { Fournisseur } from "../../../models/fournisseurTypes";
import ActionButtons from "../../common/ActionButtons";

interface Props {
  fournisseurs: Fournisseur[];
  onEdit: (fournisseur: Fournisseur) => void;
  onDelete: (fournisseur: Fournisseur) => void;
  onAddition:(fournisseur: Fournisseur)=> void; // Fixed: No need for an argument
}

const FournisseurTable: React.FC<Props> = ({ fournisseurs, onEdit, onDelete, onAddition }) => {
  const columns = [
    { name: "المعرف", selector: (row: Fournisseur) => row.id, sortable: true , maxWidth: "10px"},
    { name: "الاسم", selector: (row: Fournisseur) => row.name, sortable: true  ,  minWidth: "300px",
      maxWidth: "520px", },
    { name: "السجل التجاري", selector: (row: Fournisseur) => row.RC, sortable: true },
    { name: "NIF", selector: (row: Fournisseur) => row.NIF, sortable: true },
    { name: "AI", selector: (row: Fournisseur) => row.AI, sortable: true },
    { name: "NIS", selector: (row: Fournisseur) => row.NIS, sortable: true },
    { name: "الهاتف", selector: (row: Fournisseur) => row.TEL, sortable: true },
    { name: "الفاكس", selector: (row: Fournisseur) => row.FAX, sortable: true },
    { name: "العنوان", selector: (row: Fournisseur) => row.ADDRESS, sortable: true },
    { name: "البريد الإلكتروني", selector: (row: Fournisseur) => row.EMAIL, sortable: true },
    { name: "RIB", selector: (row: Fournisseur) => row.RIB, sortable: true },
    {
      name: "الإجراءات",
      cell: (row: Fournisseur) => (
        <ActionButtons
          item={row} // Fixed: Pass only the current row
          onEdit={onEdit} // Fixed: Use onEdit from props
          onDelete={onDelete} // Fixed: Use onDelete from props
  
        />
      ),
      ignoreRowClick: true,
      fixed: "right",
    },
  ];

  return (
    <div dir="rtl" >
    <DataTable
      columns={columns}
      data={fournisseurs}
      pagination
      highlightOnHover
      responsive
      striped
      fixedHeader
      fixedHeaderScrollHeight="600px"
      persistTableHead
    />
     </div>
  );
};

export default FournisseurTable;
