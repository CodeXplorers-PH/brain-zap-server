const { MongoClient } = require('mongodb');
const axios = require('axios');
const FormData = require('form-data');

const postBlog = async (req, res) => {
  let client = null;
  try {
    const { title, blog, category, imageBase64, author } = req.body;

    console.log("Received blog post request:", { title, category, hasImage: !!imageBase64, hasAuthor: !!author });

    // Validate required fields
    if (!title || !blog || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, blog content, and category are required'
      });
    }
    
    // Upload image to imgBB if provided
    let imgUrl = null;
    if (imageBase64) {
      try {
        // Check if API key is available
        if (!process.env.IMGBB_API_KEY) {
          console.warn('IMGBB_API_KEY is not set, using default image');
          imgUrl = '/default-blog-image.jpg';
        } else {
          // Create form data for imgBB API
          const formData = new FormData();
          
          // Handle different imageBase64 formats - ensure we extract only the base64 data part
          let base64Data;
          if (imageBase64.includes(';base64,')) {
            base64Data = imageBase64.split(';base64,').pop();
          } else {
            base64Data = imageBase64;
          }
          
          // Append the image data to the form with the correct parameter name
          formData.append('image', base64Data);
          
          console.log("Uploading image to imgBB...");
          
          // Send request to imgBB API
          const imgBBResponse = await axios({
            method: 'post',
            url: `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            data: formData,
            headers: formData.getHeaders()
          });
          
          // Get image URL from response
          if (imgBBResponse.data && imgBBResponse.data.data && imgBBResponse.data.data.url) {
            imgUrl = imgBBResponse.data.data.url;
            console.log("Image uploaded successfully:", imgUrl);
          } else {
            console.warn("Invalid imgBB response:", imgBBResponse.data);
            imgUrl = '/default-blog-image.jpg';
          }
        }
      } catch (imgError) {
        console.error('Error uploading image:', imgError.message);
        // Log more detailed error information
        if (imgError.response) {
          console.error('ImgBB API Error Response:', imgError.response.data);
        }
        // Continue with default image instead of failing
        imgUrl = '/default-blog-image.jpg';
      }
    } else {
      imgUrl = '/default-blog-image.jpg';
    }
    
    // Prepare blog object
    const newBlog = {
      title,
      blog,
      category,
      img: imgUrl,
      publish_date: new Date().toISOString(),
      likes: 0,
      author_id: author?.id || null,
      author_name: author?.name || 'Anonymous',
      author_avatar: author?.avatar || '/default-avatar.png'
    };
    
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    await client.connect();
    const db = client.db('BrainZap');
    const blogsCollection = db.collection('blogs');
    
    // Insert blog
    const result = await blogsCollection.insertOne(newBlog);
    
    if (!result.insertedId) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save blog post'
      });
    }
    
    console.log("Blog post created successfully:", result.insertedId);
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blogId: result.insertedId,
      blog: { ...newBlog, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

module.exports = { postBlog };