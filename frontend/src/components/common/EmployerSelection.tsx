import React, { useCallback } from "react";
import { Fournisseur } from "../../models/fournisseurTypes";
import { Employer } from "../../models/employerType";

interface EmployerSelectionProps {
    employers: Employer[];
    selectedEmployer: Employer | null;
    onEmployerSelect: (employer: Employer) => void;
}

const EmployerSelection: React.FC<EmployerSelectionProps> = ({
    employers,
    selectedEmployer,
    onEmployerSelect,
}) => {
    const handleSelect = useCallback(
        (employer: Employer) => {
            onEmployerSelect(employer);
        },
        [onEmployerSelect]
    );

    return (
        <div
            className="mb-3 border rounded"
            style={{ maxHeight: "250px", overflowY: "auto" }}
        >
            <ul className="list-group">
                {employers.length === 0 ? (
                    <li className="list-group-item text-muted text-center">
                        لا يوجد موظفون متاحون
                    </li>
                ) : (
                    employers.map((employer) => (
                        <li
                            key={employer.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                selectedEmployer?.id === employer.id
                                    ? "bg-primary text-white"
                                    : "bg-light"
                            }`}
                            onClick={() => handleSelect(employer)}
                            tabIndex={0}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSelect(employer)
                            }
                            style={{
                                cursor: "pointer",
                                transition: "background 0.3s",
                            }}
                        >
                            <span>{employer.fname +" " +employer.lname}</span>
                            {selectedEmployer?.id === employer.id && (
                                <span>✔️</span>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default EmployerSelection;
