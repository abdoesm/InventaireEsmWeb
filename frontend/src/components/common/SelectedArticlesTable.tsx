import React from "react";

export interface Article {
    id?: number;
    name: string;
    unite: string;
    remarque: string;
    description: string;
    idCategory: number;
    minQuantity: number;
    totalQuantity?: number;
}

export interface Entree {
    idArticle: number;
    quantity: number;
    unitPrice: number;
}

interface SelectedArticlesTableProps {
    selectedEntrees: Entree[];
    articles: Article[];
    onEntreeChange: (index: number, field: keyof Entree, value: number) => void;
}

const SelectedArticlesTable: React.FC<SelectedArticlesTableProps> = ({
    selectedEntrees,
    articles,
    onEntreeChange,
}) => {
    // Create a map for quick article lookup
    const articleMap = new Map(articles.map((article) => [Number(article.id), article]));
    console.log("Fetched Articles:", articles);
    console.log("Selected Entries:", selectedEntrees);
    

    // Calculate totals
    const totalHT = selectedEntrees.reduce((sum, entree) => sum + entree.quantity * entree.unitPrice, 0);
    const tvaAmount = totalHT * 0.19; // Assuming 19% VAT
    const totalTTC = totalHT + tvaAmount;
    if (articles.length === 0) {
        return <p>جاري تحميل المقالات...</p>;
    }
    
    return (
        <div className="mb-3">
            <h5>المقالات المحددة</h5>
            {selectedEntrees.length === 0 ? (
                <p className="text-muted">لم يتم تحديد أي مقالات.</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table className="table table-striped text-center">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: "30%" }}>المقال</th>
                                <th style={{ width: "15%" }}>الكمية</th>
                                <th style={{ width: "15%" }}>سعر الوحدة</th>
                                <th style={{ width: "20%" }}>المبلغ HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedEntrees.map((entree, index) => {
                                const article = articleMap.get(entree.idArticle);
                                const montantHT = entree.quantity * entree.unitPrice;

                                return (
                                    <tr key={entree.idArticle}>
                                        <td>{article?.name || "غير معروف"}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={entree.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    onEntreeChange(index, "quantity", Math.max(1, parseFloat(e.target.value) || 1))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={entree.unitPrice}
                                                min="0"
                                                step="any"
                                                onChange={(e) =>
                                                    onEntreeChange(index, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))
                                                }
                                            />
                                        </td>
                                        <td>{montantHT.toFixed(2)} DA</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Totals Section */}
                    <div className="text-end mt-3">
                        <p><strong>المبلغ HT:</strong> {totalHT.toFixed(2)} DA</p>
                        <p><strong>مبلغ TVA (19%):</strong> {tvaAmount.toFixed(2)} DA</p>
                        <h5><strong>المجموع TTC:</strong> {totalTTC.toFixed(2)} DA</h5>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectedArticlesTable;