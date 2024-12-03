require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { MONGO_URI, PORT } = process.env;

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// models/Lead.js
// Removed duplicate import of mongoose

// Define the schema for the Lead data
const leadSchema = new mongoose.Schema({
  Company: String,
  Lead_Name: String,
  Mobile: String,
  Lead_Status: String,
  Skill_: String,
  Title: String,
  Email: String,
  Phone: String,
  Lead_Received_By: String,
  Client_Category_Emp_Size: String,
  Industry: String,
  Created_Time: String,
  Created_By: String,
  Expected_Sales_Revenue: String,
  Lead_Received_Date: String,
  Modified_Time: String,
  Modified_By: String,
  Decision_Authority: String,
  Lead_Source: String,
  Calling_Date: String,
  Zip_Code: String,
  First_Name: String,
  State: String,
  Last_Name: String,
  Salutation: String,
  Call_Status: String,
  Data_Types: String,
  Lead_Owner: String,
  Years_of_Experience: String,
  Rating: String,
  Twitter: String,
  Annual_Revenue: String,
  Description: String,
  Skype_ID: String,
  Lead_Category: String,
  Last_Activity_Time: String,
  Secondary_Email: String,
  LinkedIn_Profile: String,
  Lead_Response_Recived_source: String,
  Website: String,
});

// Create a model from the schema
const Lead = mongoose.model('Lead', leadSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Webhook endpoint to save lead data
app.post('/webhook/zoho/leads', async (req, res) => {
  try {
    const webhookData = req.body; 
    console.log('Headers:', req.headers);
    console.log('Query Params:', req.query);
    console.log('Received webhook data:', webhookData);

    const lead = new Lead(webhookData); // Create a new Lead object with the webhook data

    await lead.save(); // Save the lead data to the database

    console.log('Lead saved successfully:', lead);
    res.status(200).send('Success');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
