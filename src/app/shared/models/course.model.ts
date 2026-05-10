export interface Course {
    id:string;
    titre:string;
    description:string;
    enseignant:string;
    enseignantId?: string,
    categorie:string;
    niveau:string;
    duree:string;
    note:number;
    chapitres: Chapitre[];
}

export interface Chapitre{
    id:string;
    titre:string;
    duree:string;
    videoUrl:string;
}