import React, { useCallback } from "react";

interface SelectionListProps<T> {
    items: T[];
    selectedItem: T | null;
    onSelect: (item: T) => void;
    getItemLabel: (item: T) => string;
    emptyMessage: string;
}

const SelectionList = <T extends { id: number }>({
    items,
    selectedItem,
    onSelect,
    getItemLabel,
    emptyMessage,
}: SelectionListProps<T>) => {
    const handleSelect = useCallback(
        (item: T) => {
            onSelect(item);
        },
        [onSelect]
    );

    return (
        <div
            className="mb-3 border rounded"
            style={{ maxHeight: "150px", overflowY: "auto" }}
        >
            <ul className="list-group">
                {items.length === 0 ? (
                    <li className="list-group-item text-muted text-center">
                        {emptyMessage}
                    </li>
                ) : (
                    items.map((item) => (
                        <li
                            key={item.id}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                selectedItem?.id === item.id
                                    ? "bg-primary text-white"
                                    : "bg-light"
                            }`}
                            onClick={() => handleSelect(item)}
                            tabIndex={0}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSelect(item)
                            }
                            style={{
                                cursor: "pointer",
                                transition: "background 0.3s",
                            }}
                        >
                            <span>{getItemLabel(item)}</span>
                            {selectedItem?.id === item.id && <span>✔️</span>}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default SelectionList;
