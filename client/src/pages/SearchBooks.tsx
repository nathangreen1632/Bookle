import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
import { searchGoogleBooks } from "../utils/api";
import Auth from "../utils/auth";
import { Book } from "../models/Book";
import { saveBookId } from "../utils/localStorage"; // ✅ Import it here

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [saveBook] = useMutation(SAVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    const books = await searchGoogleBooks(searchInput);
    setSearchedBooks(books);
  };

  const handleSaveBook = async (book: Book) => {
    if (!Auth.loggedIn()) return;

    try {
      await saveBook({ variables: { bookData: book } });
      saveBookId(book.bookId); // ✅ Save book ID to local storage
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {searchedBooks.map((book) => (
        <div key={book.bookId}>
          <h3>{book.title}</h3>
          <p>{book.authors.join(", ")}</p>
          {Auth.loggedIn() && <button onClick={() => handleSaveBook(book)}>Save</button>}
        </div>
      ))}
    </div>
  );
};

export default SearchBooks;
