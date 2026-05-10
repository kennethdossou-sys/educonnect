export interface Quiz{
    id:string;
    courseId:string;
    questions:Question[];
}

export interface Question{
    id:string;
    texte:string;
    choix:string[];
    bonneReponse:number;
}