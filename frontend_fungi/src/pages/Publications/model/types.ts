export type TPublicationsCard = {
    title: string;
    src: string;
    text: string;
    authorString: string;
};

export interface IParagraphPublication {
    articleId: string;
    id: string;
    paragraphText: string;
    isSubtitle: boolean;
    serialNumber: number;
}

export interface IPublications {
    id: string;
    title: string;
    publishDate: string; // ISO строка даты
    authorString: string;
    headerPhotoLink: string;
    paragraphs: IParagraphPublication[];
}

export interface IPublicationsCardProps {
    card: IPublications;
    onClick?: () => void;
}
