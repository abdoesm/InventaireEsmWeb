import React from "react";
import { Article } from "../../models/articleTypes";
import { Entree } from "../../models/entreeTypes";
import { Sortie } from "../../models/sortieType";

interface SelectedArticlesTableProps<T extends Entree | Sortie> {
    selectedEntrees: T[];
    articles: Article[];
    onEntreeChange: <K extends keyof T>(index: number, field: K, value: T[K]) => void;
}

// Type guard function to distinguish between Entree and Sortie
const isEntree = (entry: Entree | Sortie): entry is Entree => {
    return (entry as Entree).unitPrice !== undefined;
};

const SelectedArticlesTable = <T extends Entree | Sortie>({
    selectedEntrees,
    articles,
    onEntreeChange,
}: SelectedArticlesTableProps<T>) => {
    const articleMap = new Map(articles.map((article) => [Number(article.id), article]));

    const hasEntriesWithUnitPrice = selectedEntrees.some(isEntree);

    const totalHT = selectedEntrees
    .filter(isEntree) // Filters only Entree objects
    .reduce((sum, entree) => sum + entree.quantity * (entree as Entree).unitPrice, 0);


    const tvaAmount = totalHT * 0.19;
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
                                {hasEntriesWithUnitPrice && <th style={{ width: "15%" }}>سعر الوحدة</th>}
                                {hasEntriesWithUnitPrice && <th style={{ width: "20%" }}>المبلغ HT</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedEntrees.map((entry, index) => {
                                const article = articleMap.get(entry.idArticle);
                                return (
                                    <tr key={entry.idArticle}>
                                        <td>{article?.name || "غير معروف"}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={entry.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    onEntreeChange(index, "quantity" as keyof T, Math.max(1, parseFloat(e.target.value) || 1) as T[keyof T])
                                                }
                                            />
                                        </td>
                                        {isEntree(entry) && (
                                            <>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control text-center"
                                                        value={entry.unitPrice}
                                                        min="0"
                                                        step="any"
                                                        onChange={(e) =>
                                                            onEntreeChange(index, "unitPrice" as keyof T, Math.max(0, parseFloat(e.target.value) || 0) as T[keyof T])
                                                        }
                                                    />
                                                </td>
                                                <td>{(entry.quantity * entry.unitPrice).toFixed(2)} DA</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {hasEntriesWithUnitPrice && (
                        <div className="text-end mt-3">
                            <p><strong>المبلغ HT:</strong> {totalHT.toFixed(2)} DA</p>
                            <p><strong>مبلغ TVA (19%):</strong> {tvaAmount.toFixed(2)} DA</p>
                            <h5><strong>المجموع TTC:</strong> {totalTTC.toFixed(2)} DA</h5>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectedArticlesTable;
