import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { REMOVE_BOOK } from "../graphql/mutations";
import Auth from "../utils/auth.js";
import { removeBookId } from "../utils/localStorage.js";
import { User } from "../models/User.js";
import client from "../utils/apolloClient.ts";

const SavedBooks = () => {
  const { loading, data } = useQuery<{ me: User }>(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  if (!Auth.loggedIn()) {
    return <h2 className="text-center my-5">Please log in to view saved books.</h2>;
  }

  if (loading) {
    return <h2 className="text-center my-5">Loading...</h2>;
  }

  const books = data?.me?.savedBooks || [];

  const handleRemoveBook = async (bookId: string) => {
    try {
      await removeBook({
        variables: { bookId },
      });

      removeBookId(bookId);

      await client.refetchQueries({
        include: [GET_ME],
      });

      await client.resetStore();
    } catch (err) {
      console.error("Error removing book:", err);
    }
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Saved Books</h2>

      {books.length === 0 ? (
        <p className="text-center">No saved books yet!</p>
      ) : (
        <div className="row g-4">
          {books.map((book) => (
            <div className="col-md-4" key={book.bookId}>
              <div className="card h-100">
                <img
                  src={book.image ?? "https://via.placeholder.com/300x450?text=No+Image"}
                  alt={book.title}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "500px", width: "100%" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book?.title ?? "Untitled Book"}</h5>
                  <p className="card-text">{book.authors?.join(", ") ?? "Unknown Author"}</p>

                  <button
                    className="btn btn-danger mt-auto"
                    onClick={() => handleRemoveBook(book.bookId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBooks;
