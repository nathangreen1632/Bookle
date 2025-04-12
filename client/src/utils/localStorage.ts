export const getSavedBookIds = (): string[] => {
  try {
    const savedBooks = localStorage.getItem("saved_books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  } catch (error) {
    console.warn("Error reading saved_books from localStorage:", error);
    return [];
  }
};

export const saveBookId = (bookId: string): void => {
  const savedBooks = getSavedBookIds();

  if (!savedBooks.includes(bookId)) {
    savedBooks.push(bookId);
    localStorage.setItem("saved_books", JSON.stringify(savedBooks));
  }
};

export const removeBookId = (bookId: string): void => {
  const savedBooks = getSavedBookIds().filter((id) => id !== bookId);
  localStorage.setItem("saved_books", JSON.stringify(savedBooks));
};
