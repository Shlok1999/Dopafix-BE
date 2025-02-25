const { DataTypes } = require('sequelize');
const sequelize = require('../Config/db');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Noaccess',
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0, 
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'inactive',
        },
        created_On: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        modified_On: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    },
    {
        tableName: 'gd_users',
        timestamps: false,
    }
);

const UserRole = sequelize.define(
    'user_role',
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User, 
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        revenue: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        advertisers: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'user_role',
        timestamps: false,
        indexes: [
            {
                unique: false,
                fields: ['user_id', 'platform'],
            },
        ],
    }
);

const DataSource = sequelize.define(
    'data_source',
    {
        platform: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        advertisers: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        partner: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gd_tables: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        tableName: 'data_source',
        timestamps: false,
        // primaryKey: false,
    }
);

module.exports = { User, UserRole, DataSource };