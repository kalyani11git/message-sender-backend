const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies


// Twilio Configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token


if (!accountSid || !authToken) {
    throw new Error('Missing Twilio credentials in .env file');
  }
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio phone number
const client = twilio(accountSid, authToken);



// API Endpoint to send SMS
app.post('/send-message', async (req, res) => {
  const { mobileNumber, message } = req.body;

  if (!mobileNumber || !message) {
    return res.status(400).json({ error: 'Mobile number and message are required.' });
  }

  try {
    // Send SMS using Twilio
    const response = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: mobileNumber,
    });

    console.log('Message sent successfully:', response.sid);
    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: error.message || 'Failed to send message.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
