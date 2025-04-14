const { MongoClient, ObjectId } = require('mongodb');

const deleteBlog = async (req, res) => {
  let client = null;
  try {
    const { id } = req.params;
    const { userId } = req.body; // To verify ownership
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGO_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const db = client.db('BrainZap');
    const blogsCollection = db.collection('blogs');
    const likesCollection = db.collection('blogLikes');
    
    // Check if blog exists and user is the author
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Verify ownership (only the author can delete)
    if (blog.author_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this blog'
      });
    }
    
    // Delete blog
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    
    // Delete associated likes
    await likesCollection.deleteMany({ blogId: id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

module.exports = { deleteBlog };