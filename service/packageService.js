const Package = require('../models/packageModel.js')

exports.createPackage = async (data) => {
    try {
        const newPackage = await Package.create(data);
        return newPackage;
      } catch (error) {
        console.error("Error creating package:", error);
        throw error;
      }
};

exports.getAllPackages = async () => {
    return await Package.find();
};