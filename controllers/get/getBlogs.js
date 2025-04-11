const { MongoClient, ObjectId } = require('mongodb');

const getBlogs = async (req, res) => {
  let client = null;
  try {
    // Safely extract and validate query parameters
    const category = req.query.category || null;
    const search = req.query.search || '';
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    
    // MongoDB connection
    client = new MongoClient(process.env.MONGO_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const db = client.db('BrainZap');
    const blogsCollection = db.collection('blogs');
    
    // Build query with more careful handling
    let query = {};
    
    // Filter by category if provided and not 'All'
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Only add search condition if search string is not empty
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { blog: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log('Query:', JSON.stringify(query)); // Debug logging
    
    // Execute query with pagination
    const blogs = await blogsCollection
      .find(query)
      .sort({ publish_date: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await blogsCollection.countDocuments(query);
    
    res.status(200).json({
      success: true,
      total,
      blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

const getBlogById = async (req, res) => {
  let client = null;
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }
    
    client = new MongoClient(process.env.MONGO_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await client.connect();
    const db = client.db('BrainZap');
    const blogsCollection = db.collection('blogs');
    
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

module.exports = { getBlogs, getBlogById };