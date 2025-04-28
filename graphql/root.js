const { getAdminDashboard } = require("../controllers/get/getAdminDashboard");
const { getBlogs, getBlogById } = require("../controllers/get/getBlogs");

const root = {
  blogs: async (args) => await getBlogs(args),
  blog: async (args) => await getBlogById(args),
  adminDashboard: async ({email}) => await getAdminDashboard(email),
};

module.exports = root;
