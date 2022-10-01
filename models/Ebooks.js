module.exports = (sequelize, DataTypes) => {
  const EBooks = sequelize.define("EBooks", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pageCount: {
      type: DataTypes.INTEGER,
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.TEXT("long"),
    },
    shortDescription: {
      type: DataTypes.TEXT("long"),
    },
    longDescription: {
      type: DataTypes.TEXT("long"),
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
    },
    rent: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return EBooks;
};
