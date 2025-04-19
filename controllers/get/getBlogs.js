const { ObjectId } = require("mongodb");
const { connectDB } = require("../../config/database");

const getBlogs = async ({
  category = null,
  search = "",
  limit = 20,
  skip = 0,
}) => {
  try {
    const blogsCollection = await connectDB("blogs");
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { blog: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await blogsCollection
      .find(query)
      .sort({ publish_date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await blogsCollection.countDocuments(query);

    return {
      success: true,
      total,
      blogs,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error("Failed to fetch blogs");
  }
};

const getBlogById = async ({ _id }) => {
  try {
    const blogsCollection = await connectDB("blogs");
    const blog = await blogsCollection.findOne({ _id: new ObjectId(_id) });
    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw new Error("Failed to fetch blog");
  }
};

module.exports = { getBlogs, getBlogById };
