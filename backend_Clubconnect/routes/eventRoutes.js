// routes/eventRoutes.js
import {auth} from '../middleware/authmiddleware.js'
import Event from '../models/Event.js';

import {createEvent, getEvents,likeEvent, getLikeStatus,getTopLikedEvents,getEventById,registerForEvent } from '../controllers/eventController.js'// Make sure the path is correct
import { upload } from '../utils/multer.js';
import { Router } from 'express';
const EventRouter = Router();

EventRouter.get('/:id', getEventById);

EventRouter.post('/create', upload.array('images', 3), createEvent);
EventRouter.get('/all/getEvent', getEvents);
EventRouter.post('/:id/like',auth, likeEvent);
EventRouter.get('/:id/like',  auth, getLikeStatus);
EventRouter.get('/all/top-events', getTopLikedEvents);
EventRouter.post('/studentregister', registerForEvent);



// this need to be fixed now 
EventRouter.get('/check-events', async (req, res) => {
    try {
      const count = await Event.countDocuments();
      console.log('Total events in database:', count); // Debug log
      res.json({ 
        success: true,
        count,
        message: `Found ${count} events in the database`
      });
    } catch (error) {
      console.error('Error checking events:', error); // Debug log
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });
  


export default EventRouter;
