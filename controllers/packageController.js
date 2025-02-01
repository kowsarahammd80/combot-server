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