"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("order_items", {
    id: { type: "int", unsigned: true, primaryKey: true, autoIncrement: true },
    order_date: {
      type: "string",
      length: 500,
    },
    quantity: { type: "int", unsigned: true },
    user_id: {
      type: "int",
      notNull: true,
      foreignKey: {
        name: "order_items_user_fk",
        table: "users",
        mapping: "id",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
    },
    product_id: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "order_items_product_fk",
        table: "products",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: "id",
      },
    },
    shipping_address: {
      type: "string",
      length: 1000,
    },
    order_status: {
      type: "string",
      length: 500,
      defaultValue: "unattended",
    },
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
