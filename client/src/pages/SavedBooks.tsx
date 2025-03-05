import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { REMOVE_BOOK } from "../graphql/mutations";
import Auth from "../utils/auth.js";
import { removeBookId } from "../utils/localStorage.js";
import { User } from "../models/User.js";

const SavedBooks = () => {
  const { loading, data } = useQuery<{ me: User }>(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  if (!Auth.loggedIn()) {
    return <h2>Please log in to view saved books.</h2>;
  }

  if (loading) return <h2>Loading...</h2>;

  const books = data?.me?.savedBooks || [];

  const handleRemoveBook = async (bookId: string) => {
    try {
      await removeBook({ variables: { bookId } });
      removeBookId(bookId); // ✅ Update local storage
    } catch (err) {
      console.error("Error removing book:", err);
    }
  };

  return (
    <div>
      <h2>Saved Books</h2>
      {books.length === 0 ? <p>No saved books yet!</p> : null}
      {books.map((book) => (
        <div key={book.bookId}>
          <h3>{book.title}</h3>
          <button onClick={() => handleRemoveBook(book.bookId)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default SavedBooks;
