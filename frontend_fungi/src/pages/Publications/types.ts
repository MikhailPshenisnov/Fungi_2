export type TPublicationsCard = {
    title: string;
    src: string;
    text: string;
    author: string;
}

export interface IParagraphPublication {
  paragraphText?: string | null;
}

export interface IPublications {
  id: string;
  title: string;
  publishDate: string; // ISO строка даты
  authorString: string;
  headerPhotoLink: string;
  paragraphs: IParagraphPublication[];
}