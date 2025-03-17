import React, { useCallback } from "react";
import { Fournisseur } from "../../models/fournisseurTypes";

interface FournisseurSelectionProps {
    fournisseurs: Fournisseur[];
    selectedFournisseur: Fournisseur | null;
    onFournisseurSelect: (fournisseur: Fournisseur) => void;
}

const FournisseurSelection: React.FC<FournisseurSelectionProps> = ({
    fournisseurs,
    selectedFournisseur,
    onFournisseurSelect,
}) => {
    const handleSelect = useCallback(
        (fournisseur: Fournisseur) => {
            onFournisseurSelect(fournisseur);
        },
        [onFournisseurSelect]
    );

    return (
        <div
            className="mb-3 border rounded"
            style={{ maxHeight: "250px", overflowY: "auto" }}
        >
            <ul className="list-group">
                {fournisseurs.length === 0 ? (
                    <li className="list-group-item text-muted text-center">
                        لا يوجد موردون متاحون
                    </li>
                ) : (
                    fournisseurs.map((fournisseur) => (
                        <li
                            key={fournisseur.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                selectedFournisseur?.id === fournisseur.id
                                    ? "bg-primary text-white"
                                    : "bg-light"
                            }`}
                            onClick={() => handleSelect(fournisseur)}
                            tabIndex={0}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSelect(fournisseur)
                            }
                            style={{
                                cursor: "pointer",
                                transition: "background 0.3s",
                            }}
                        >
                            <span>{fournisseur.name}</span>
                            {selectedFournisseur?.id === fournisseur.id && (
                                <span>✔️</span>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default FournisseurSelection;
