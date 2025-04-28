const { generateQuiz } = require('../controllers/get/getQuizzes');
const { getBlogs, getBlogById } = require('../controllers/get/getBlogs');

const root = {
  getQuizzes: async args => generateQuiz(args),
  blogs: async args => await getBlogs(args),
  blog: async args => await getBlogById(args),
};

module.exports = root;
