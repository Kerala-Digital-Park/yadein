const express = require("express");
const adminController = require('../controllers/adminController');
const upload = require('../middleware/multer')
const router = express.Router();

router.post('/admin/login',adminController.login);
router.post('/admin/add-batch',adminController.addBatch);
router.post('/admin/add-class',upload.single("profileImage"),adminController.addClass);
router.post('/admin/add-student', upload.single("profileImage"),adminController.addStudent);
router.post('/admin/add-staff', upload.single("profileImage"),adminController.addStaff);
router.post('/admin/add-batch-admin/:year',adminController.addBatchAdmin);
router.post('/admin/add-class-admin/:year/:classForm',adminController.addClassAdmin);
router.post('/admin/add-job',adminController.addJob);
router.post('/admin/add-sponsor', upload.single("profileImage"),adminController.addSponsor);
router.post('/admin/add-update', upload.single("profileImage"),adminController.addUpdate);
router.post('/admin/add-student-update',adminController.addStudentUpdate);

router.get('/admin/dashboard-stats', adminController.dashStats)
router.get('/admin/admin-list/batchadmin', adminController.listBatchAdmin)
router.get('/admin/admin-list/classadmin', adminController.listClassAdmin)
router.get('/admin/batch-list', adminController.listBatch)
router.get('/admin/class-list', adminController.listClass)
router.get('/admin/batch-class-list', adminController.listBatchClass)
router.get('/admin/student-list', adminController.listStudent)
router.get('/admin/staff-list', adminController.listStaff)
router.get('/admin/class-student-list', adminController.listClassStudent)
router.get('/admin/job-list', adminController.listJobs)
router.get('/admin/sponsor-list',adminController.listSponsor)
router.get('/admin/get-batch-admin/:year', adminController.getBatchAdmin)
router.get('/admin/get-class-admin/:year/:classForm', adminController.getClassAdmin)
router.get('/admin/get-class-form/:id',adminController.getClassFormById)
router.get('/admin/get-batch/:id',adminController.getBatchById)
router.get('/admin/get-batchId/:year',adminController.getIdByBatch)
router.get('/admin/get-batchadmin-batch/:id',adminController.getBatchByBatchAdmin)
router.get('/admin/get-classadmin-batch/:id',adminController.getClassByClassAdmin)
router.get('/admin/update-list', adminController.listUpdates)

router.delete('/admin/job-delete/:jobId',adminController.deleteJob)
router.delete('/admin/class-delete/:classId',adminController.deleteClass)
router.delete('/admin/batch-delete/:batchId',adminController.deleteBatch)
router.delete('/admin/student-delete/:studentId',adminController.deleteStudent)
router.delete('/admin/staff-delete/:staffId',adminController.deleteStaff)
router.delete('/admin/admin-delete/batchadmin/:adminId',adminController.deleteBatchAdmin)
router.delete('/admin/admin-delete/classadmin/:adminId',adminController.deleteClassAdmin)
router.delete('/admin/sponsor-delete/:sponsorId',adminController.deleteSponsor)
router.delete('/admin/update-delete/:studentId',adminController.deleteUpdate)

router.put('/admin/job-edit/:jobId',adminController.editJob);
router.put('/admin/class-edit/:classId', upload.single("image"),adminController.editClass);
router.put('/admin/batch-edit/:batchId',adminController.editBatch);
router.put('/admin/student-edit/:studentId', upload.single("image"),adminController.editStudent);
router.put('/admin/staff-edit/:staffId', upload.single("image"),adminController.editStaff);
router.put('/admin/admin-edit/batchadmin/:adminId',adminController.editBatchAdmin);
router.put('/admin/admin-edit/classadmin/:adminId',adminController.editClassAdmin);
router.put('/admin/sponsor-edit/:sponsorId', upload.single("image"),adminController.editSponsor);
router.put('/admin/update-edit/:studentId', upload.single("image"),adminController.editUpdate);

router.post('/user/login', adminController.userLogin)
router.post('/user/signup', adminController.userSignup)

router.get('/user/:userId', adminController.fetchUser)

module.exports = router;
