import Registration from '../models/Registration.js';

export const registerStudent = async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRegistrationsByEvent = async (req, res) => {
  const { eventId } = req.params;
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
