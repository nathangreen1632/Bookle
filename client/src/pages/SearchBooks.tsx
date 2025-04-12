import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
import { searchGoogleBooks } from "../utils/api";
import Auth from "../utils/auth";
import { Book } from "../models/Book";
import { saveBookId } from "../utils/localStorage";
import client from "../utils/apolloClient.ts";

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  const [saveBook] = useMutation(SAVE_BOOK, {
    refetchQueries: [{query: GET_ME}],
  });

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    const books = await searchGoogleBooks(searchInput);
    setSearchedBooks(books);
  };

  const handleSaveBook = async (book: Book) => {
    if (!Auth.loggedIn()) return;

    try {
      await saveBook({
        variables: { book },
      });

      saveBookId(book.bookId);

      await client.resetStore();
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  return (
    <div className="container my-5">
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search for a book..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {searchedBooks.length === 0 && (
        <p className="text-muted">No books found. Try searching!</p>
      )}

      <div className="row g-4">
        {searchedBooks.map((book) => (
          <div className="col-md-4" key={book.bookId}>
            <div className="card h-100">
              <img
                src={book.image ?? "https://via.placeholder.com/300x450?text=No+Image"}
                alt={book.title}
                className="card-img-top"
                style={{ objectFit: "cover", height: "750px", width: "100%" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">
                  {book.authors?.join(", ") ?? "Unknown Author"}
                </p>

                {Auth.loggedIn() && (
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => handleSaveBook(book)}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

  export default SearchBooks;
