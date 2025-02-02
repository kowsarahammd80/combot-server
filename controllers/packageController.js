const packageService = require('../service/packageService.js')

exports.createPackageController = async (req, res) => {
    try {  
      const packageData = req.body;
      console.log(packageData)
      const newPackage = await packageService.createPackage(packageData);
      res.status(201).json({ success: true, data: newPackage });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllPackagesController = async (req, res) => {
    try {
      const packages = await packageService.getAllPackages();
      res.status(200).json({ success: true, data: packages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

exports.deletePackageController = async (req, res) => {
  try {
      const { id } = req.params;
      const deletedPackage = await packageService.deletePackageByIdService(id);
      
      if (!deletedPackage) {
          return res.status(404).json({ success: false, message: "Package not found" });
      }

      res.status(200).json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};