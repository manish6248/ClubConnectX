// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  venue: {                   
    type: String,
    required: [true, 'Venue is required'],
    trim: true},
    
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    
  clubName: {  
    type: String,
    required: true
  },
  performer: {  
    type: String,
    required: false
  },
  institution: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String, 
    required: [true, 'Event time is required'],
    validate: {
      validator: function(v) {
        // Validate time format (HH:mm)
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid time format! Use HH:mm format`
    }
  },
  isFree: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    required: function() {
      return !this.isFree;
    },
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true
  },
  images: [{
    public_id: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  //add registrations array field to include leader.name,leader.email, teamName, teamMembers
  registrations: [{
    leader: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    },
    teamName: {
      type: String,
      required: true
    },
    college: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    teamMembers: [
      {name: { 
        type: String,
        required: true
      }}
    ]
  }],
});

export default mongoose.model('Event', eventSchema);
