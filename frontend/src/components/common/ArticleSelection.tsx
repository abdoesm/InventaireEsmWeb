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

interface ArticleSelectionProps {
    articles: Article[];
    selectedEntrees: { idArticle: number; quantity: number; unitPrice: number }[];
    onArticleSelect: (article: Article) => void;
}

const ArticleSelection: React.FC<ArticleSelectionProps> = ({
    articles,
    selectedEntrees,
    onArticleSelect,
}) => {
    return (
        <div className="mb-3" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
            <ul className="list-group">
                {articles.map((article) => {
                    const isSelected = selectedEntrees.some((e) => e.idArticle === article.id);

                    return (
                        <li
                            key={article.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${isSelected ? "bg-light" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => onArticleSelect(article)}
                        >
                            <span className="d-flex flex-wrap w-100 justify-content-between">
                                <strong>{article.name}</strong>
                                <small className="text-muted">{article.unite}</small>
                                <span>الكمية: <strong>{article.totalQuantity}</strong></span>
                            </span>

                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => onArticleSelect(article)}
                                onClick={(e) => e.stopPropagation()} // Prevent parent click
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ArticleSelection;