import React, { useMemo } from "react";
import { Article } from "../../models/articleTypes";
import { Entree } from "../../models/entreeTypes";
import { Sortie } from "../../models/sortieType";
import { Retour } from "../../models/retourType";
interface SelectedArticlesTableProps<T extends Entree | Sortie | Retour> {
    selectedItems: T[];  // More generic than selectedEntrees
    articles: Article[];
    onItemChange: <K extends keyof T>(index: number, field: K, value: T[K]) => void;
}

// Type guard to check if an entry is an Entree
const isEntree = (entry: Entree | Sortie | Retour): entry is Entree => "unitPrice" in entry;


const SelectedArticlesTable = <T extends Entree | Sortie | Retour>({
    selectedItems,
    articles,
    onItemChange,
}: SelectedArticlesTableProps<T>) => {
    const articleMap = useMemo(
        () => new Map(articles.map((article) => [Number(article.id), article])),
        [articles]
    );
    const hasEntriesWithUnitPrice = selectedItems.some(isEntree);

    const totalHT = useMemo(
        () =>
            selectedItems
                .filter(isEntree)
                .reduce((sum, entree) => sum + entree.quantity * (entree as Entree).unitPrice, 0),
        [selectedItems]
    );

    const tvaAmount = useMemo(() => totalHT * 0.19, [totalHT]);
    const totalTTC = useMemo(() => totalHT + tvaAmount, [totalHT, tvaAmount]);

    if (articles.length === 0) {
        return <p>جاري تحميل المقالات...</p>;
    }

    return (
        <div className="mb-3">
            <h5>📌 المقالات المحددة</h5>
            {selectedItems.length === 0 ? (
                <p className="text-muted">لم يتم تحديد أي مقالات.</p>
            ) : (
                <div style={{ maxHeight: "150px",  overflowX: "auto" }}>
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
                            {selectedItems.map((entry, index) => {
                                const article = articleMap.get(entry.idArticle);
                                return (
                                    <tr key={entry.idArticle}>
                                        <td>{article?.name || "❌ غير معروف"}</td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                value={entry.quantity}
                                                min="1"
                                                onChange={(e) =>
                                                    onItemChange(index, "quantity" as keyof T, Math.max(1, Number(e.target.value) || 1) as T[keyof T])
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
                                                            onItemChange(index, "unitPrice" as keyof T, Math.max(0, Number(e.target.value) || 0) as T[keyof T])
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
                            <p>
                                <strong>💰 المبلغ HT:</strong> {totalHT.toFixed(2)} DA
                            </p>
                            <p>
                                <strong>📊 مبلغ TVA (19%):</strong> {tvaAmount.toFixed(2)} DA
                            </p>
                            <h5 className="text-success">
                                <strong>🛒 المجموع TTC:</strong> {totalTTC.toFixed(2)} DA
                            </h5>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SelectedArticlesTable;
