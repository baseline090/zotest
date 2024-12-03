require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

// Load environment variables from .env file
const {
  ZOHO_API_DOMAIN,
  MONGO_URI,
  PORT,
} = process.env;

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// MongoDB Schema for Lead
const leadSchema = new mongoose.Schema({
  years_of_experience: { type: Number, default: null },
  company: String,
  trainer_skill: { type: String, default: null },
  owner: { name: String, id: String, email: String },
  email: String,
  currency_symbol: String,
  visitor_score: { type: Number, default: null },
  degree_completion_year: { type: Number, default: null },
  field_states: { type: Object, default: null },
  degree_name: { type: String, default: null },
  followers: { type: Array, default: null },
  data_types: [String],
  lead_received_date: { type: Date, default: null },
  last_activity_time: { type: Date, default: null },
  industry: String,
  state: String,
  unsubscribed_mode: { type: String, default: null },
  converted: { type: Boolean, default: false },
  process_flow: { type: Boolean, default: false },
  locked_for_me: { type: Boolean, default: false },
  zip_code: { type: String, default: null },
  lead_id: String,
  approved: { type: Boolean, default: true },
  lead_received_by: { type: String, default: null },
  approval: {
    delegate: { type: Boolean, default: false },
    takeover: { type: Boolean, default: false },
    approve: { type: Boolean, default: false },
    reject: { type: Boolean, default: false },
    resubmit: { type: Boolean, default: false },
  },
  year_of_experience: { type: Number, default: null },
  first_visited_url: { type: String, default: null },
  days_visited: { type: Number, default: null },
  closing_amount: { type: Number, default: null },
  created_time: { type: Date },
  followed: { type: Boolean, default: false },
  editable: { type: Boolean, default: true },
  client_partner: String,
  program_list: { type: Array, default: null },
  state_name: String,
  country: String,
  last_visited_time: { type: Date, default: null },
  created_by: { name: String, id: String, email: String },
  zia_owner_assignment: String,
  secondary_email: String,
  annual_revenue: { type: Number, default: null },
  description: { type: String, default: null },
  semester: { type: String, default: null },
  number_of_chats: { type: Number, default: null },
  campaign_name: { type: String, default: null },
  whatsapp_marketing_status: { type: String, default: 'No' },
  rating: { type: Number, default: null },
  review_process: {
    approve: { type: Boolean, default: false },
    reject: { type: Boolean, default: false },
    resubmit: { type: Boolean, default: false },
  },
  website: { type: String, default: null },
  twitter: { type: String, default: null },
  expected_sales_revenue: { type: Number, default: null },
  average_time_spent_minutes: { type: Number, default: null },
  salutation: { type: String, default: null },
  user_3: { type: String, default: null },
  full_name: String,
  lead_status: { type: String, default: 'New' },
  record_image: { type: String, default: null },
  client_category: String,
  modified_by: { name: String, id: String, email: String },
  skype_id: { type: String, default: null },
  phone: { type: String, default: '0' },
  university_types: { type: String, default: null },
  sfj_course_delivered: { type: String, default: null },
  call_status: { type: String, default: 'New' },
  decision_authority: String,
  designation: String,
  data_added_year: { type: Number, default: new Date().getFullYear() },
  calling_data: { type: Array, default: null },
  modified_time: { type: Date },
  converted_detail: { type: Object, default: {} },
  unsubscribed_time: { type: Date, default: null },
  mobile: { type: String, default: '0' },
  linkedIn_profile: String,
  skill: String,
  ipo_listed: { type: String, default: 'NA' },
  auto_number_1: String,
  email_delivery_status: { type: String, default: null },
  referrer: { type: String, default: null },
  lead_source: String,
  client_category_revenue: { type: Number, default: null },
  tag: { type: Array, default: [] },
  response_received_source: { type: String, default: null },
  approval_state: { type: String, default: 'approved' },
});

// Create the model based on the schema
const Lead = mongoose.model('Lead', leadSchema);


// Function to fetch leads from Zoho CRM
const fetchLeads = async (req, res) => {
  try {
    const accessToken = "1000.6e3e1e8e86f0b562a46824f8c9022392.22984614ce26f8e56780e75b7ec575aa"

    const response = await axios.get(`${ZOHO_API_DOMAIN}/crm/v2/Leads`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      // params: { per_page: 500, page: 1 },
    });
  console.log(response,"sahil response");

    console.log("Fetched leads successfully:", response.data.data.length);
    await saveLeadsToDB(response.data.data);
    res.status(200).json({ message: "Leads synced successfully" });
  } catch (error) {
    console.error("Error fetching leads:", error.response?.data || error.message);
    res.status(500).json({ error: "An error occurred while syncing leads." });
  }
};


// Function to save leads into MongoDB
async function saveLeadsToDB(leads) {
  console.log('Saving leads to MongoDB...');
  try {
    for (const lead of leads) {
      console.log(`Saving lead with ID: ${lead.Lead_ID}`);
      const newLead = new Lead({
        years_of_experience: lead.Years_of_Experience,
        company: lead.Company,
        trainer_skill: lead.Trainer_Skill,
        owner: lead.Owner,
        email: lead.Email,
        currency_symbol: lead["$currency_symbol"],
        visitor_score: lead.Visitor_Score,
        degree_completion_year: lead.Degree_Completion_Year,
        field_states: lead["$field_states"],
        degree_name: lead.Degree_Name,
        followers: lead["$followers"],
        data_types: lead.Data_Types,
        lead_received_date: new Date(lead.Lead_Received_Date),
        last_activity_time: new Date(lead.Last_Activity_Time),
        industry: lead.Industry,
        state: lead.State,
        unsubscribed_mode: lead.Unsubscribed_Mode,
        converted: lead.Converted,
        process_flow: lead.Process_Flow,
        locked_for_me: lead.Locked_for_me,
        zip_code: lead.Zip_Code,
        lead_id: lead.Lead_ID,
        approved: lead.Approved,
        lead_received_by: lead.Lead_Received_By,
        approval: lead.Approval,
        year_of_experience: lead.Year_of_Experience,
        first_visited_url: lead.First_Visited_URL,
        days_visited: lead.Days_Visited,
        closing_amount: lead.Closing_Amount,
        created_time: new Date(lead.Created_Time),
        followed: lead["$followed"],
        editable: lead["$editable"],
        client_partner: lead.Client_Partner,
        program_list: lead.Program_List,
        state_name: lead.State_Name,
        country: lead.Country,
        last_visited_time: new Date(lead.Last_Visited_Time),
        created_by: lead.Created_By,
        zia_owner_assignment: lead.Zia_Owner_Assignment,
        secondary_email: lead.Secondary_Email,
        annual_revenue: lead.Annual_Revenue,
        description: lead.Description,
        semester: lead.Semester,
        number_of_chats: lead.Number_of_Chats,
        campaign_name: lead.Campaign_Name,
        whatsapp_marketing_status: lead.Whatsapp_Marketing_Status,
        rating: lead.Rating,
        review_process: lead.Review_Process,
        website: lead.Website,
        twitter: lead.Twitter,
        expected_sales_revenue: lead.Expected_Sales_Revenue,
        average_time_spent_minutes: lead.Average_Time_Spent_Minutes,
        salutation: lead.Salutation,
        user_3: lead.User_3,
        full_name: lead.Full_Name,
        lead_status: lead.Lead_Status,
        record_image: lead.Record_Image,
        client_category: lead.Client_Category,
        modified_by: lead.Modified_By,
        skype_id: lead.Skype_ID,
        phone: lead.Phone,
        university_types: lead.University_Types,
        sfj_course_delivered: lead.Sfj_Course_Delivered,
        call_status: lead.Call_Status,
        decision_authority: lead.Decision_Authority,
        designation: lead.Designation,
        data_added_year: lead.Data_Added_Year,
        calling_data: lead.Calling_Data,
        modified_time: new Date(lead.Modified_Time),
        converted_detail: lead.Converted_Detail,
        unsubscribed_time: new Date(lead.Unsubscribed_Time),
        mobile: lead.Mobile,
        linkedIn_profile: lead.LinkedIn_Profile,
        skill: lead.Skill,
        ipo_listed: lead.Ipo_Listed,
        auto_number_1: lead.Auto_Number_1,
        email_delivery_status: lead.Email_Delivery_Status,
        referrer: lead.Referrer,
        lead_source: lead.Lead_Source,
        client_category_revenue: lead.Client_Category_Revenue,
        tag: lead.Tag,
        response_received_source: lead.Response_Received_Source,
        approval_state: lead.Approval_State,
      });
      
      await newLead.save(); // Save lead to MongoDB
    }
    console.log('Leads saved to MongoDB successfully!');
  } catch (error) {
    console.error('Error saving leads to MongoDB:', error);
    throw error;
  }
}

// Sync leads endpoint
app.get('/sync-leads', async (req, res) => {
    console.log('Received request to sync leads...');
    try {
      // Fetch leads from Zoho CRM
      const leads = await fetchLeads();
  
      // Save leads to MongoDB
      await saveLeadsToDB(leads);
  
      res.status(200).json({ message: 'Leads fetched and saved successfully' });
    } catch (error) {
      console.error('Error in /sync-leads:', error);
      res.status(500).json({ error: 'An error occurred while syncing leads.' });
    }
  });
// Start the server
const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const mongoose = require('mongoose');

// // Load environment variables from .env file
// const {
//   ZOHO_ACCESS_TOKEN,
//   ZOHO_API_DOMAIN,
//   MONGO_URI,
//   PORT,
// } = process.env;

// // Initialize express
// const app = express();
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // MongoDB Schema for Lead
// const leadSchema = new mongoose.Schema({
//     owner: {
//       name: { type: String, required: true },
//       id: { type: String, required: true },
//       email: { type: String, required: true },
//     },
//     company: { type: String, required: true },
//     email: { type: String, required: true },
//     currency_symbol: { type: String, required: true },
//     field_states: { type: String, default: null },
//     last_activity_time: { type: Date, default: null },
//     industry: { type: String, default: null },
//     state: { type: String, default: null },
//     unsubscribed_mode: { type: String, default: null },
//     converted: { type: Boolean, default: false },
//     process_flow: { type: Boolean, default: false },
//     street: { type: String, default: null },
//     locked_for_me: { type: Boolean, default: false },
//     zip_code: { type: String, default: null },
//     lead_id: { type: String, unique: true, default: function() { return new mongoose.Types.ObjectId(); } },  // Use unique ID if Lead_ID is not present
//     approved: { type: Boolean, default: false },
//     approval: {
//       delegate: { type: Boolean, default: false },
//       takeover: { type: Boolean, default: false },
//       approve: { type: Boolean, default: false },
//       reject: { type: Boolean, default: false },
//       resubmit: { type: Boolean, default: false }
//     },
//     created_time: { type: Date, default: Date.now },
//     editable: { type: Boolean, default: true },
//     city: { type: String, default: null },
//     no_of_employees: { type: Number, default: null },
//     state: { type: String, default: null },
//     country: { type: String, default: null },
//     created_by: {
//       name: { type: String, required: true },
//       id: { type: String, required: true },
//       email: { type: String, required: true },
//     },
//     zia_owner_assignment: { type: String, default: 'owner_recommendation_unavailable' },
//     annual_revenue: { type: Number, default: null },
//     secondary_email: { type: String, default: null },
//     description: { type: String, default: null },
//     rating: { type: String, default: null },
//     review_process: {
//       approve: { type: Boolean, default: false },
//       reject: { type: Boolean, default: false },
//       resubmit: { type: Boolean, default: false }
//     },
//     website: { type: String, default: null },
//     twitter: { type: String, default: null },
//     salutation: { type: String, default: null },
//     first_name: { type: String, required: true },
//     full_name: { type: String, required: true },
//     lead_status: { type: String, required: true },
//     record_image: { type: String, default: null },
//     modified_by: {
//       name: { type: String, required: true },
//       id: { type: String, required: true },
//       email: { type: String, required: true },
//     },
//     review: { type: String, default: null },
//     skype_id: { type: String, default: null },
//     phone: { type: String, required: true },
//     email_opt_out: { type: Boolean, default: false },
//     designation: { type: String, required: true },
//     modified_time: { type: Date, default: Date.now },
//     converted_detail: { type: Object, default: {} },
//     unsubscribed_time: { type: Date, default: null },
//     mobile: { type: String, required: true },
//     orchestration: { type: Boolean, default: false },
//     last_name: { type: String, required: true },
//     in_merge: { type: Boolean, default: false },
//     locked: { type: Boolean, default: false },
//     lead_source: { type: String, required: true },
//     tag: { type: [String], default: [] },
//     fax: { type: String, default: null },
//     approval_state: { type: String, default: 'approved' },
//   });

// // Create the model based on the schema
// const Lead = mongoose.model('Lead', leadSchema);

// // Function to fetch leads from Zoho CRM
// const fetchLeads = async (req, res) => {
//   try {
//     const response = await axios.get(`${ZOHO_API_DOMAIN}/crm/v2/Leads`, {
//       headers: { Authorization: `Bearer ${ZOHO_ACCESS_TOKEN}` },
//     });

//     console.log("Fetched leads successfully:", response.data.data.length);
//     await saveLeadsToDB(response.data.data);
//     res.status(200).json({ message: "Leads synced successfully" });
//   } catch (error) {
//     console.error("Error fetching leads:", error.response?.data || error.message);
//     res.status(500).json({ error: "An error occurred while syncing leads." });
//   }
// };

// // Function to save leads into MongoDB
// async function saveLeadsToDB(data) {
//     try {
//       for (const lead of data) {
//         const newLead = new Lead({
//           owner: lead.Owner,
//           company: lead.Company,
//           email: lead.Email,
//           currency_symbol: lead['$currency_symbol'],
//           field_states: lead['$field_states'],
//           last_activity_time: lead.Last_Activity_Time ? new Date(lead.Last_Activity_Time) : null,
//           industry: lead.Industry,
//           state: lead.$state,
//           unsubscribed_mode: lead.Unsubscribed_Mode,
//           converted: lead.$converted,
//           process_flow: lead.$process_flow,
//           street: lead.Street,
//           locked_for_me: lead['$locked_for_me'],
//           zip_code: lead.Zip_Code,
//           lead_id: lead.id || new mongoose.Types.ObjectId(),
//           approved: lead.$approved,
//           approval: lead.$approval,
//           created_time: new Date(lead.Created_Time),
//           editable: lead.$editable,
//           city: lead.City,
//           no_of_employees: lead.No_of_Employees,
//           country: lead.Country,
//           created_by: lead.Created_By,
//           zia_owner_assignment: lead['$zia_owner_assignment'],
//           annual_revenue: lead.Annual_Revenue,
//           secondary_email: lead.Secondary_Email,
//           description: lead.Description,
//           rating: lead.Rating,
//           review_process: lead['$review_process'],
//           website: lead.Website,
//           twitter: lead.Twitter,
//           salutation: lead.Salutation,
//           first_name: lead.First_Name,
//           full_name: lead.Full_Name,
//           lead_status: lead.Lead_Status,
//           record_image: lead.Record_Image,
//           modified_by: lead.Modified_By,
//           review: lead['$review'],
//           skype_id: lead.Skype_ID,
//           phone: lead.Phone,
//           email_opt_out: lead.Email_Opt_Out,
//           designation: lead.Designation,
//           modified_time: new Date(lead.Modified_Time),
//           converted_detail: lead['$converted_detail'],
//           unsubscribed_time: lead.Unsubscribed_Time ? new Date(lead.Unsubscribed_Time) : null,
//           mobile: lead.Mobile,
//           orchestration: lead['$orchestration'],
//           last_name: lead.Last_Name,
//           in_merge: lead['$in_merge'],
//           locked: lead.Locked__s,
//           lead_source: lead.Lead_Source,
//           tag: lead.Tag,
//           fax: lead.Fax,
//           approval_state: lead['$approval_state'],
//         });
  
//         await newLead.save();
//       }
//       console.log('Leads saved successfully!');
//     } catch (error) {
//       console.error('Error saving leads:', error);
//     }
//   }
// // Define routes
// app.get('/sync-leads', fetchLeads);

// // Start the server
// const port = PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
