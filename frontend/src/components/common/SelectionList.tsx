import React, { useCallback, useEffect, useRef } from "react";

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
    const selectedRef = useRef<HTMLLIElement | null>(null);

    const handleSelect = useCallback(
        (item: T) => {
            onSelect(item);
        },
        [onSelect]
    );

    // Scroll to selected item when component mounts or selectedItem changes
    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [selectedItem]);

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
                            ref={selectedItem?.id === item.id ? selectedRef : null}
                            className={`list-group-item d-flex justify-content-between align-items-center ${
                                selectedItem?.id === item.id
                                    ? "bg-primary text-white"
                                    : "bg-light"
                            }`}
                            onClick={() => handleSelect(item)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) =>
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
