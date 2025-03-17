import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Article } from "../../models/articleTypes";

interface ArticleSelectionProps<T extends { idArticle: number; quantity: number }> {
    articles: Article[];
    selectedEntrees: T[];
    onArticleSelect: (article: Article) => void;
}

const ArticleSelection = <T extends { idArticle: number; quantity: number }>({
    articles,
    selectedEntrees,
    onArticleSelect,
}: ArticleSelectionProps<T>) => {
    const columns: TableColumn<Article>[] = [
        {
            name: "اسم المقال",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "الوحدة",
            selector: (row) => row.unite,
            sortable: true,
            width: "120px",
        },
        {
            name: "الكمية",
            selector: (row) => row.totalQuantity ?? 0, // ✅ Ensure number type
            sortable: true,
            center: true,
            width: "120px",
        },
        {
            name: "اختيار",
            cell: (row) => {
                const isSelected = selectedEntrees.some((e) => e.idArticle === row.id);
                return (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onArticleSelect(row)}
                        style={{ cursor: "pointer", width: "18px", height: "18px" }}
                    />
                );
            },
            width: "100px",
            center: true,
        },
    ];

    return (
        <DataTable
            title="اختيار المقالات"
            columns={columns}
            data={articles}
            selectableRowsHighlight
            highlightOnHover
            pagination
            responsive
            customStyles={{
                headCells: {
                    style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                        backgroundColor: "#f8f9fa",
                    },
                },
            }}
        />
    );
};

export default ArticleSelection;
