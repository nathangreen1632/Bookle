import { GoogleAPIBook } from "../models/GoogleAPIBook.js";
import { Book } from "../models/Book.js";

export const searchGoogleBooks = async (query: string): Promise<Book[]> => {
  const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      console.warn("Google Books API responded with error:", response.status);
      return [];
    }

    const data = await response.json();

    if (!data.items || !Array.isArray(data.items)) {
      console.warn("Google Books API returned no items for query:", query);
      return [];
    }

    return data.items.map((book: GoogleAPIBook) => {
      const image =
        book.volumeInfo.imageLinks?.extraLarge ??
        book.volumeInfo.imageLinks?.large ??
        book.volumeInfo.imageLinks?.medium ??
        book.volumeInfo.imageLinks?.thumbnail ??
        "https://via.placeholder.com/400x550?text=No+Image";

      return {
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors ?? ["Unknown Author"],
        description: book.volumeInfo.description ?? "No description available",
        image: image,
        link: book.volumeInfo.infoLink ?? "#",
      };
    });
  } catch (error) {
    console.error("Network error while fetching books:", error);
    return [];
  }
};
