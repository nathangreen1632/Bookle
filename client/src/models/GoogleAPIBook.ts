export interface GoogleAPIBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      medium: string;
      large: string;
      extraLarge: string;
      thumbnail: string };
    infoLink?: string;
  };
}
