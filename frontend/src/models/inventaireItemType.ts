export interface InventaireItem {
    id?: number;
    idArticle: number;
    idUser: number;
    idLocalisation?: number;
    idEmployer?: number;
    numInventaire?: string;
    dateInventaire?: string;
    status?: string;
}