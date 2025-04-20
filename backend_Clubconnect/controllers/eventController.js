
import { log } from 'console';
import Event from '../models/Event.js';
import cloudinary from '../utils/cloudinary.js';

export const createEvent = async (req, res) => {
  try {
    const {
      name,
      institution,
      venue,
      date,
      time,
      isFree,
      price,
      description,
      clubName,
      performer
    } = req.body;

    
    if (!name || !institution || !date || !time || !description || !clubName) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:mm format (e.g., 14:30)'
      });
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'events',
        resource_type: 'auto'
      });

      return {
        public_id: result.public_id,
        url: result.secure_url
      };
    });

    const imageUrls = await Promise.all(uploadPromises);

    const event = new Event({
      name,
      institution,
      venue,
      date: new Date(date),
      clubName,
      performer,
      time,
      isFree: isFree === 'true',
      price: isFree === 'true' ? 0 : parseFloat(price),
      description,
      images: imageUrls
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });

  } catch (error) {
    // Delete uploaded images if event creation fails
    if (req.files) {
      for (const file of req.files) {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id);
        }
      }
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add the getEvents function
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    // console.log("events",events);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const toggleLike = async (req, res) => {
  try {
      const event = await Event.findById(req.params.eventId);
      
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Initialize likes array if it doesn't exist
      if (!event.likes) {
          event.likes = [];
      }

      // Get user ID from auth middleware
      const userId = req.user._id; // Make sure your auth middleware provides this

      // Check if user has already liked the event
      const userLikeIndex = event.likes.findIndex(
          (id) => id.toString() === userId.toString()
      );
      
      if (userLikeIndex === -1) {
          // User hasn't liked the event yet - add like
          event.likes.push(userId);
          event.likeCount = (event.likeCount || 0) + 1;
      } else {
          // User already liked - remove like
          event.likes.splice(userLikeIndex, 1);
          event.likeCount = Math.max(0, (event.likeCount || 1) - 1);
      }

      // Save the updated event
      await event.save();
      
      return res.json({ 
          success: true,
          likeCount: event.likeCount,
          isLiked: userLikeIndex === -1,
          message: userLikeIndex === -1 ? 'Event liked successfully' : 'Event unliked successfully'
      });

  } catch (error) {
      console.error('Error in toggleLike:', error);
      res.status(500).json({ 
          success: false, 
          message: 'Error processing like/unlike',
          error: error.message 
      });
  }
};


export const getTopLikedEvents = async (req, res) => {
  try {
    // console.log('Starting to fetch top events');
    
    const topEvents = await Event.find()
      .sort({ likeCount: -1 })
      .limit(3);

    // console.log('Found events:', topEvents);

    res.status(200).json({
      success: true,
      data: topEvents
    });
  } catch (error) {
    console.log('Detailed error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


export const likeEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id; // From auth middleware

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has already liked the event
    const isLiked = event.likes.includes(userId);

    if (isLiked) {
      // Unlike: Remove user from likes array
      event.likes = event.likes.filter(id => id.toString() !== userId.toString());
      event.likeCount = Math.max(0, event.likeCount - 1);
    } else {
      // Like: Add user to likes array
      event.likes.push(userId);
      event.likeCount = (event.likeCount || 0) + 1;
    }

    await event.save();

    res.json({
      success: true,
      data: {
        likeCount: event.likeCount,
        isLiked: !isLiked
      }
    });
  } catch (error) {
    console.error('Like event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing like'
    });
  }
};



export const getLikeStatus = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const isLiked = event.likes.includes(userId);

    res.json({
      success: true,
      data: {
        likeCount: event.likeCount,
        isLiked
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching like status',
      error: error.message
    });
  }
};


export const getEventById = async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

//Student register 
export const registerForEvent = async (req, res) => {
  try {
    
    const {eventId,  leader, teamName, teamMembers } = req.body;
    // console.log("body",req.body);
    

    if (!leader.name || !leader.email || !teamName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    event.registrations.push({ leader, teamName, teamMembers });
    event.save();
    res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.log("error",error);
    
    res.status(500).json({ success: false, message: error.message });
  }
};
