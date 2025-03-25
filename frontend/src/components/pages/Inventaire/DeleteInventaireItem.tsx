import React from 'react';

interface DeleteInventaireItemProps {
    onClose: () => void;
    InventaireItemId: number;
    fetchInventaireItems: () => void;
}

const DeleteInventaireItem: React.FC<DeleteInventaireItemProps> = ({
    onClose,
    InventaireItemId,
    fetchInventaireItems,
}) => {
    const handleDelete = async () => {
        try {
            // Replace with your API call to delete the item
            await fetch(`/api/inventaire/${InventaireItemId}`, {
                method: 'DELETE',
            });
            fetchInventaireItems(); // Refresh the list after deletion
            onClose(); // Close the delete form
        } catch (error) {
            console.error('Failed to delete the item:', error);
        }
    };

    return (
        <div className="delete-inventaire-item">
            <p>Are you sure you want to delete this item?</p>
            <div>
                <button onClick={handleDelete}>Yes, Delete</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default DeleteInventaireItem;