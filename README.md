# Bookle

## What is Bookle?

Bookle is a full-stack web application that allows users to search for books using the Google Books API, save their favorite books, and manage a personal library of saved books.

## Purpose

Help users easily search for books, save books to their account, and manage a list of books they want to read or purchase later.

## How to Use Bookle

Search for books using the search bar.

If you are not logged in, you can search and view results.

If you want to save books, you need to create an account or log in.

### Signup Process

Click Login/Signup in the navigation.

Choose Signup.

Enter a username, email, and password.

Click Signup.

### Login Process

Click Login/Signup in the navigation.

Choose Login.

Enter your email and password.

Click Login.

### Saving Books

Search for any book.

Click Save This Book! under any search result.

Saved books will appear in your Saved Books page.

### Removing Books

Go to My Saved Books.

Click Remove This Book to remove a book from your list.

### Logout

Click Logout in the navigation to securely log out.

## Technologies Used

React.js

Apollo Client

React Router

TailwindCSS

Google Books API

Node.js

Express.js

Apollo Server

GraphQL

MongoDB with Mongoose

JWT Authentication

bcrypt

dotenv

## GraphQL Queries and Mutations

Query: me  
Returns the logged-in user and their saved books.

Mutation: addUser  
Creates a new user account.

Mutation: login  
Logs in an existing user.

Mutation: saveBook  
Saves a book to the user profile.

Mutation: removeBook  
Removes a book from the user profile.

## File Structure

bookle/

client/  
src/  
components/  
pages/  
utils/  
App.tsx

server/  
schemas/  
models/  
services/  
server.ts

## Environment Variables

In the server directory, create a .env file with the following:

MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret_key  
PORT=4000

## Installation Instructions

Clone the repository.

git clone https://github.com/your-username/bookle.git  
cd bookle

Install dependencies.

cd server  
npm install

cd ../client  
npm install

Start the backend server.

cd server  
npm run dev

Start the frontend server.

cd ../client  
npm run dev

View the app in your browser.

Frontend: http://localhost:5173/  
GraphQL Playground: http://localhost:4000/graphql

## Future Improvements

Pagination for search results

Book tagging or categorization

User reviews or ratings for books

Email notifications for saved books

Dark mode toggle

Mobile app version

## License

MIT License

## Author

Nathan Green

Full-Stack Developer

LinkedIn: https://www.linkedin.com/in/nathan-green1632

GitHub: https://github.com/nathangreen1632

## Acknowledgments

Google Books API

Apollo GraphQL

MongoDB

UTSA Full-Stack Coding Bootcamp  
