'use strict'
const { v4: uuidv4 } = require('uuid');

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

module.exports = {
  up: async (queryInterface, QueryInterface) => {
    await queryInterface.bulkInsert("plans", [
      {
        uuid: uuidv4(),
        name: "Regular",
        amount: "10000",
        period_days: 30,
        value: JSON.stringify(regular_value),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        name: "Standard",
        amount: "10000",
        period_days: 30,
        value: JSON.stringify(standard_value),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        name: "Premium",
        amount: "10000",
        period_days: 30,
        value: JSON.stringify(premium_value),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuidv4(),
        name: "Enterprise",
        amount: "10000",
        period_days: 30,
        value: JSON.stringify(enterprise_value),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, QueryInterface) => {
    await queryInterface.bulkDelete("plans", {});
  },
};
