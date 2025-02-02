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

exports.deletePackageByIdService = async (id) => {
  try {
      const deletedPackage = await Package.findByIdAndDelete(id);
      return deletedPackage;
  } catch (error) {
      throw new Error(error.message);
  }
};