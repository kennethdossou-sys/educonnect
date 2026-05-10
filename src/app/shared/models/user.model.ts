export interface User{
    uid: string;
    email:string;
    nom:string;
    prenom:string;
    role: 'etudiant' | 'enseignant';
}