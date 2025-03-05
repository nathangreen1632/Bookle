import { GoogleAPIBook } from "../models/GoogleAPIBook.js";
import { Book } from "../models/Book.jsx";

export const searchGoogleBooks = async (query: string): Promise<Book[]> => {
  const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Google Books API request failed");
    }

    const data = await response.json();
    return data.items.map((book: GoogleAPIBook) => ({
      bookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors ?? ["Unknown Author"],
      description: book.volumeInfo.description ?? "No description available",
      image: book.volumeInfo.imageLinks?.thumbnail ?? "",
      link: book.volumeInfo.infoLink ?? "#",
    }));
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};
