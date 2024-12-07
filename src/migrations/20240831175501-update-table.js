'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'subscriptions', 'customer_amount',
        {
            type: Sequelize.STRING,
            allowNull: true
            
        },
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('subscriptions', 'customer_amount')
    ]);
  }
};