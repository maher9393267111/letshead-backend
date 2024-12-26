'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER
            },
            userID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Users', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, couponID: {
                type: Sequelize.INTEGER, allowNull: true, references: {
                    model: 'Coupons', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, couponPrice: {
                type: Sequelize.INTEGER, allowNull: true,
            },
            productID: {
                type: Sequelize.INTEGER, allowNull: false, references: {
                    model: 'Products', key: 'id',
                }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
            }, productTotalPrice: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, total: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, subPostcode: {
                type: Sequelize.STRING, allowNull: false
            }, installDate: {
                type: Sequelize.DATEONLY, allowNull: false,
            }, installPrice: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, postcodePrice: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, discount: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, tax: {
                type: Sequelize.INTEGER, allowNull: false, defaultValue: 0,
            }, status: {
                type: Sequelize.INTEGER, defaultValue: 0, allowNull: false,
            }, preQuestionStatus: {
                type: Sequelize.INTEGER, allowNull: true,
            }, postQuestionStatus: {
                type: Sequelize.INTEGER, allowNull: true,
            }, imageEvidenceStatus: {
                type: Sequelize.INTEGER, allowNull: true,
            },preQuestionCancelReason: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            }, postQuestionCancelReason: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            }, imageEvidenceCancelReason: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            },  type: {
                type: Sequelize.INTEGER, defaultValue: 0, allowNull: false,
            }, note: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            }, cancelReason: {
                type: Sequelize.STRING(1000),
                allowNull: true,
            }, createdAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), allowNull: false
            },
            updatedAt: {
                type: 'TIMESTAMP', defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE, allowNull: true,
            },
        });
    }, down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Orders');
    }
};
