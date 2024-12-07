'use strict'
const { v4: uuidv4 } = require('uuid');

const permission = [
    {
       "name":"View Admins",
       "value":"view_admins"
    },
    {
       "name":"Create Admin",
       "value":"create_admin"
    },
    {
       "name":"Edit Admin",
       "value":"edit_admin"
    },
    {
       "name":"Delete Admin",
       "value":"delete_admin"
    },
    {
       "name":"View Exams",
       "value":"view_exams"
    },
    {
       "name":"View Exam Analytics",
       "value":"view_exam_analytics"
    },
    {
       "name":"Create Exams",
       "value":"create_exams"
    },
    {
       "name":"Edit Exams",
       "value":"edit_exams"
    },
    {
       "name":"Delete Exams",
       "value":"delete_exams"
    },
    {
       "name":"Grade Exams",
       "value":"grade_exams"
    },
    {
       "name":"Publish Exams",
       "value":"publish_exams"
    },
    {
       "name":"View Subject",
       "value":"view_subject"
    },
    {
       "name":"Create Subject",
       "value":"create_subject"
    },
    {
       "name":"Edit Subject",
       "value":"edit_subject"
    },
    {
       "name":"Delete Subject",
       "value":"delete_subject"
    },
    {
       "name":"View Class",
       "value":"view_class"
    },
    {
       "name":"Create Class",
       "value":"create_class"
    },
    {
       "name":"Edit Class",
       "value":"edit_class"
    },
    {
       "name":"Delete Class",
       "value":"delete_class"
    },
    {
       "name":"View Roles",
       "value":"view_roles"
    },
    {
       "name":"Create Roles",
       "value":"create_roles"
    },
    {
       "name":"Edit Roles",
       "value":"edit_roles"
    },
    {
       "name":"Delete Roles",
       "value":"delete_roles"
    },
    {
       "name":"View Billing",
       "value":"view_billing"
    },
    {
       "name":"Edit Billing",
       "value":"edit_billing"
    },
    {
       "name":"Delete Billing",
       "value":"delete_billing"
    },
    {
       "name":"View Activity Logs",
       "value":"view_activity_logs"
    },
    {
       "name":"View Dashboard Analytics",
       "value":"view_dashboard_analytics"
    },
    {
       "name":"View Results",
       "value":"view_results"
    },
    {
       "name":"View Responses",
       "value":"view_responses"
    }
 ];

module.exports = {
  up: async (queryInterface, QueryInterface) => {
    await queryInterface.bulkInsert("settings", [
      {
        name: "permission",
        value: JSON.stringify(permission),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, QueryInterface) => {
    await queryInterface.bulkDelete("settings", {});
  },
};
