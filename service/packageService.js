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
    return await Package.find().sort({ date: -1 });
};

exports.deletePackageByIdService = async (id) => {
  try {
      const deletedPackage = await Package.findByIdAndDelete(id);
      return deletedPackage;
  } catch (error) {
      throw new Error(error.message);
  }
};

exports.getPackageByIdService = async (id) => {
  try {
    const packageData = await Package.findById(id);
    if (!packageData) {
      return { error: "Package not found" };
    }
    return packageData;
  } catch (error) {
    throw new Error("Error fetching package by ID");
  }
};

exports.updatePackageByIdService = async (id, updatedData) => {
  try {
      const updatedPackage = await Package.findByIdAndUpdate(id, updatedData, { new: true });

      return updatedPackage;
  } catch (error) {
      throw new Error(error.message);
  }
};