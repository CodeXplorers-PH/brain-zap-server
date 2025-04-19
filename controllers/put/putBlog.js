const { MongoClient, ObjectId } = require("mongodb");
const axios = require("axios");
const FormData = require("form-data");

const likeBlog = async (req, res) => {
  let client = null;
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    // Connect to MongoDB
    client = new MongoClient(process.env.MONGO_URII, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("BrainZap");
    const blogsCollection = db.collection("blogs");
    const likesCollection = db.collection("blogLikes");

    // Check if user already liked this blog
    const existingLike = await likesCollection.findOne({
      blogId: id,
      userId,
    });

    if (existingLike) {
      // Unlike: Remove the like from the likes collection
      await likesCollection.deleteOne({ _id: existingLike._id });

      // Decrement the blog's like count
      await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { likes: -1 } }
      );

      return res.status(200).json({
        success: true,
        message: "Blog unliked successfully",
        liked: false,
      });
    } else {
      // Like: Add a new entry to the likes collection
      await likesCollection.insertOne({
        blogId: id,
        userId,
        timestamp: new Date(),
      });

      // Increment the blog's like count
      await blogsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { likes: 1 } }
      );

      return res.status(200).json({
        success: true,
        message: "Blog liked successfully",
        liked: true,
      });
    }
  } catch (error) {
    console.error("Error updating blog like:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog like",
      error: error.message,
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

const updateBlog = async (req, res) => {
  let client = null;
  try {
    const { id } = req.params;
    const { title, blog, category, imageBase64 } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }

    // Connect to MongoDB
    client = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db("BrainZap");
    const blogsCollection = db.collection("blogs");

    // Check if blog exists and user is the author
    const existingBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Update fields
    const updateData = {};
    if (title) updateData.title = title;
    if (blog) updateData.blog = blog;
    if (category) updateData.category = category;

    // Handle image update if provided
    if (imageBase64) {
      try {
        // Create form data for imgBB API
        const formData = new FormData();
        formData.append("image", imageBase64.split(";base64,").pop());

        // Send request to imgBB API
        const imgBBResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
          formData,
          {
            headers: formData.getHeaders(),
          }
        );

        // Update image URL
        updateData.img = imgBBResponse.data.data.url;
      } catch (imgError) {
        console.error("Error uploading image:", imgError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: imgError.message,
        });
      }
    }

    // Update blog
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

module.exports = { likeBlog, updateBlog };
