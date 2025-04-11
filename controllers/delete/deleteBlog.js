const { MongoClient, ObjectId } = require('mongodb');

const deleteBlog = async (req, res) => {
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
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db('BrainZap');
    const blogsCollection = db.collection('blogs');
    const likesCollection = db.collection('blogLikes');
    
    // Check if blog exists and user is the author
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      await client.close();
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Verify ownership (only the author or admin can delete)
    if (blog.author_id !== userId && !req.isAdmin) {
      await client.close();
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this blog'
      });
    }
    
    // Delete blog
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    
    // Delete associated likes
    await likesCollection.deleteMany({ blogId: id });
    
    await client.close();
    
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
  }
};

module.exports = { deleteBlog };