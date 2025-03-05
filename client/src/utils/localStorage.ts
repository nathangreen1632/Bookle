export const getSavedBookIds = (): string[] => {
  return JSON.parse(localStorage.getItem("saved_books") || "[]");
};

export const saveBookId = (bookId: string) => {
  const savedBooks = getSavedBookIds();
  if (!savedBooks.includes(bookId)) {
    savedBooks.push(bookId);
    localStorage.setItem("saved_books", JSON.stringify(savedBooks));
  }
};

export const removeBookId = (bookId: string) => {
  const savedBooks = getSavedBookIds().filter((id) => id !== bookId);
  localStorage.setItem("saved_books", JSON.stringify(savedBooks));
};
