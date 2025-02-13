const express = require("express");
const adminController = require('../controllers/adminController');
const jwtMiddleware = require('../middleware/jwtMiddleware')
const upload = require('../middleware/multer')
const router = express.Router();

router.post('/admin/login',adminController.login);
router.post('/admin/add-batch',adminController.addBatch);
router.post('/admin/add-class',adminController.addClass);
router.post('/admin/add-student', upload.single("profileImage"),adminController.addStudent);
router.post('/admin/add-staff', upload.single("profileImage"),adminController.addStaff);
router.post('/admin/add-batch-admin/:year',adminController.addBatchAdmin);
router.post('/admin/add-class-admin/:year/:classForm',adminController.addClassAdmin);
router.post('/admin/add-job',adminController.addJob);

router.get("/admin/dashboard-stats", adminController.dashStats)
router.get('/admin/admin-list/batchadmin', adminController.listBatchAdmin)
router.get('/admin/admin-list/classadmin', adminController.listClassAdmin)
router.get('/admin/batch-list', adminController.listBatch)
router.get('/admin/class-list', adminController.listClass)
router.get('/admin/batch-class-list', adminController.listBatchClass)
router.get('/admin/student-list', adminController.listStudent)
router.get('/admin/staff-list', adminController.listStaff)
router.get('/admin/class-student-list', adminController.listClassStudent)
router.get('/admin/job-list', adminController.listJobs)
router.get('/admin/get-batch-admin/:year', adminController.getBatchAdmin)
router.get('/admin/get-class-admin/:year/:classForm', adminController.getClassAdmin)
router.get('/admin/get-class-form/:id',adminController.getClassFormById)
router.get('/admin/get-batch/:id',adminController.getBatchById)
router.get('/admin/get-batchadmin-batch/:id',adminController.getBatchByBatchAdmin)
router.get('/admin/get-classadmin-batch/:id',adminController.getClassByClassAdmin)

router.delete('/admin/job-delete/:jobId',adminController.deleteJob)
router.delete('/admin/class-delete/:classId',adminController.deleteClass)
router.delete('/admin/batch-delete/:batchId',adminController.deleteBatch)
router.delete('/admin/student-delete/:studentId',adminController.deleteStudent)
router.delete('/admin/staff-delete/:staffId',adminController.deleteStaff)
router.delete('/admin/admin-delete/batchadmin/:adminId',adminController.deleteBatchAdmin)
router.delete('/admin/admin-delete/classadmin/:adminId',adminController.deleteClassAdmin)

router.put('/admin/job-edit/:jobId',adminController.editJob);
router.put('/admin/class-edit/:classId',adminController.editClass);
router.put('/admin/batch-edit/:batchId',adminController.editBatch);
router.put('/admin/student-edit/:studentId', upload.single("image"),adminController.editStudent);
router.put('/admin/staff-edit/:staffId', upload.single("image"),adminController.editStaff);
router.put('/admin/admin-edit/batchadmin/:adminId',adminController.editBatchAdmin);
router.put('/admin/admin-edit/classadmin/:adminId',adminController.editClassAdmin);

module.exports = router;
