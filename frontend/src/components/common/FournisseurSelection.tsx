import React from "react";
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
    return (
        <div className="mb-3" style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "5px" }}>
            <ul className="list-group">
                {fournisseurs.map((fournisseur) => (
                    <li
                        key={fournisseur.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                        onClick={() => onFournisseurSelect(fournisseur)}
                        style={{ cursor: "pointer" }}
                    >
                        <span>{fournisseur.name}</span>
                        {selectedFournisseur?.id === fournisseur.id && <span>✔️</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FournisseurSelection;