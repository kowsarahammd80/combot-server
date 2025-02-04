const router = require('express').Router()
const packageController = require ('../controllers/packageController.js')

router.delete('/packageDelete/:id', packageController.deletePackageController)
router.post('/package-add', packageController.createPackageController)
router.get('/getAllPackages', packageController.getAllPackagesController)
router.get('/getAllPackages/:id', packageController.getPackageByIdController)
router.patch('/update-package/:id', packageController.updatePackageController)

module.exports = router;