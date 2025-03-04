import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: ID!
        authors: [String]
        title: String!
        description: String
        image: String
        link: String
    }

    type Auth {
        token: String!
        user: User!
    }

    type Query {
        me: User
    }

    input BookInput {
        bookId: ID!
        authors: [String]
        title: String!
        description: String
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(book: BookInput!): User
        removeBook(bookId: ID!): User
    }
`;

export default typeDefs;
