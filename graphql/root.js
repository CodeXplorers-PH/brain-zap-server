const { getBlogs, getBlogById } = require("../controllers/get/getBlogs");

const root = {
  blogs: async (args) => await getBlogs(args),
  blog: async (args) => await getBlogById(args),
};

module.exports = root;