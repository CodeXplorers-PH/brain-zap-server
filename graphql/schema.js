const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Questions {
   question: String!
   options: [String!]!
   answer: String!
  }

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

  type Feedback {
  _id: ID!
  name: String!
  email: String!
  message: String!
  feedbackType: String!
  date: String!
}

type AdminDashboard {
 totalUsers: Int!
 totalFeedback: Int!
 totalFreeUsers: Int!
 totalProUsers: Int!
 totalEliteUsers: Int!
 latestFeedback: [Feedback!]!
}

type AllFeedback {
  _id: ID!
  name: String!
  email: String!
  message: String!
  feedbackType: String!
  date: String!
  read: String
}

type Query {
  getQuizzes(topic: String!, difficulty:String, quizzesNumber: Int, type: String): [Questions!]!
  blogs(category: String, search: String, limit: Int, skip: Int): BlogQueryResult
  blog(_id: ID!): Blog
  adminDashboard(email: String): AdminDashboard
  feedback(email: String): [AllFeedback!]!
}`);

module.exports = schema;
