// migrations/insert-users.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Your MongoDB URI (replace with your actual URI)
const mongoURI = 'mongodb://localhost:27017/gea';

const regular_value = [
    "1 Admin User",
    "5 Teachers",
    "10 Students per class",
    "50 Assessment Creation",
    "Member Portal",
    "Data Export",
    "Detailed Results",
    "Bulk question upload",
    "Auto Grading",
    "Dedicated sub-domain"
  ];
  
const standard_value = [
    "3 Admin Users",
    "10 Teachers",
    "20 Students per class",
    "100 Assessment Creation",
    "Member Portal",
    "Data Export",
    "Detailed Results",
    "Business Grade Security",
    "Bulk question upload",
    "Auto Grading",
    "Parent portal",
    "Dedicated sub-domain"
  ];
  
const premium_value =  [
    "10 Admin Users",
    "30 Teachers",
    "40 Students per class",
    "Unlimited Assessment Creation",
    "Member Portal",
    "Data Export",
    "Detailed Results",
    "Business Grade Security",
    "Result structure",
    "School Branding",
    "Bulk Invitation",
    "Bulk question upload",
    "Auto Grading",
    "Insights & Analysis",
    "Invite members via email",
    "Dedicated sub-domain"
  ];
  
const enterprise_value = [   
    "Unlimited Admin Users",
    "Unlimited Teachers",
    "Unlimited students",
    "Unlimited assessments",
    "Member Portal",
    "Data Export",
    "Program Structure",
    "Result Structure",
    "Business branding",
    "Custom domain",
    "API integration",
    "SSO integration",
    "Bulk question upload",
    "Auto Grading",
    "Insights & Analysis",
    "Question Feedback",
    "Assessment Feedback",
    "Invite members via email",
    "Embed Assessment",
    "Overall performance View",
    "Bulk member Invitation",
    "School branding",
    "Activity Log ",
    "Announcement",
    "Response Statistics",
    "Program Structure",
    "Dedicated Server"
  ];

// Define your user schema (this could be in a separate file)
const PlanSchema = new mongoose.Schema(
    {
      uuid: {
          type: String,
          required: true, // Must be provided
        },
      name: {
          type: String,
          required: true, // Must be provided
        },
      amount: {
        type: String,
        required: true, // Must be provided
      },
      period_days: {
        type: String,
        required: false, // Not required
      },
      value: {
        type: [String],
        required: false,
      }
    },
    {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // Enable timestamps and use custom field names
    }
  );

// Create a User model from the schema
const Plan = mongoose.model('plans', PlanSchema);

async function runMigration() {
  try {
    // Connect to the database
    await mongoose.connect(mongoURI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Define the data to insert
    const plans = [
        {
            uuid: uuidv4(),
            name: "Regular",
            amount: "10000",
            period_days: 30,
            value: regular_value,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            uuid: uuidv4(),
            name: "Standard",
            amount: "10000",
            period_days: 30,
            value: standard_value,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            uuid: uuidv4(),
            name: "Premium",
            amount: "10000",
            period_days: 30,
            value: premium_value,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            uuid: uuidv4(),
            name: "Enterprise",
            amount: "10000",
            period_days: 30,
            value: enterprise_value,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
    ];

    // Insert the data into the 'users' collection
    await Plan.insertMany(plans);
    console.log('Users inserted successfully');

  } catch (err) {
    console.error('Error running migration', err);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
runMigration();
