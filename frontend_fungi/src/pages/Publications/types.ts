export type TPublicationsCard = {
  title: string;
  src: string;
  text: string;
  author: string;
};

// export interface IParagraphPublication {
//   paragraph?: string | null;
// }

export interface IPublications {
  id: string;
  title: string;
  publishDate: string; // ISO строка даты
  author: string;
  headerPhotoLink: string;
  paragraphs: string[];
}
