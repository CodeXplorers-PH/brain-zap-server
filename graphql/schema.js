const { buildSchema } = require("graphql");

const schema = buildSchema(`

type Blog {
  _id: ID!
  title: String!
  blog: String!
  category: String!
  img: String!
  publish_date: String!
  likes: Int!
  author_id: String!
  author_name: String!
  author_avatar: String!
}

type BlogQueryResult {
  success: Boolean!
  total: Int!
  blogs: [Blog!]!
}

type Query {
  blogs(category: String, search: String, limit: Int, skip: Int): BlogQueryResult
  blog(_id: ID!): Blog
}

`);

module.exports = schema;
