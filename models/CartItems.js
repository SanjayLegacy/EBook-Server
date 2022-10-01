module.exports = (sequelize, DataTypes) => {
  const CartItems = sequelize.define("CartItems", {
    itemId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    noOfDays: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    cartId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return CartItems;
};
