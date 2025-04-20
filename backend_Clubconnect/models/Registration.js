import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: String,
});

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  leader: {
    name: String,
    email: String,
    phone: String,
    college: String
  },
  teamName: String,
  teamMembers: [teamMemberSchema],
  registeredAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
