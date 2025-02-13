const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admins = require("../models/adminSchema");
const batches = require("../models/batchSchema");
const classes = require("../models/classSchema");
const batchadmins = require("../models/batchAdminSchema");
const classadmins = require("../models/classAdminSchema");
const students = require("../models/studentSchema");
const staffs = require("../models/staffSchema");
const dotenv = require("dotenv");
const jobs = require("../models/jobSchema");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

dotenv.config();

exports.login = async (req, res) => {
  console.log("Inside adminController: login function");
  try {
    const { email, password, adminType } = req.body;

    let collection;
    if (adminType === "superadmin") {
      collection = admins;
    } else if (adminType === "batchadmin") {
      collection = batchadmins;
    } else if (adminType === "classadmin") {
      collection = classadmins;
    } else {
      return res.status(400).json({ message: "Invalid admin type" });
    }

    const admin = await collection.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, adminType: admin.adminType },
      process.env.SECRET_KEY
    );

    res
      .status(200)
      .json({ token, adminType: admin.adminType, userId: admin._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addBatchAdmin = async (req, res) => {
  console.log("Inside adminController: add batch admin function");
  const year = req.params.year;
  const { email, password } = req.body;

  try {
    const existingAdmin = await batchadmins.findOne({ batch: year });
    if (existingAdmin) {
      return res.status(406).json("Admin already exists");
    }

    const newAdmin = new batchadmins({
      email: email,
      password: password,
      batch: year,
      adminType: "batchadmin",
    });

    await newAdmin.save();

    res.status(200).json("Admin added successfully");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Unable to add admin due to " + err.message });
  }
};

exports.addClassAdmin = async (req, res) => {
  console.log("Inside adminController: add class admin function");

  const year = req.params.year;
  const classForm = req.params.classForm;
  const { email, password } = req.body;

  try {
    const existingAdmin = await classadmins.findOne({ email });
    if (existingAdmin) {
      return res.status(406).json("Admin already exists");
    }

    const newAdmin = new classadmins({
      email: email,
      password: password,
      batch: year,
      classForm: classForm,
      adminType: "classadmin",
    });

    await newAdmin.save();

    res.status(200).json("Admin added successfully");
  } catch (err) {
    res
      .status(500)
      .json({ error: "Unable to add admin due to " + err.message });
  }
};

exports.dashStats = async (req, res) => {
  try {
    const { batch, cls } = req.query;
    console.log("batch", batch, cls);

    const [
      classAdminCount,
      batchAdminCount,
      staffCount,
      studentCount,
      batchCount,
      classCount,
      classCountByBatch,
      studentCountByClass
    ] = await Promise.all([
      classadmins.countDocuments(),
      batchadmins.countDocuments(),
      staffs.countDocuments(),
      students.countDocuments(),
      batches.countDocuments(),
      classes.countDocuments(),
      batch ? classes.countDocuments({ batch: batch }) : 0,
      cls ? students.countDocuments({batch: batch, classForm: cls}) : 0
    ]);

    const adminCount = classAdminCount + batchAdminCount;

    res.json({
      adminCount,
      staffCount,
      studentCount,
      batchCount,
      classCount,
      classCountByBatch,
      studentCountByClass
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.listBatchAdmin = async (req, res) => {
  try {
    const admins = await batchadmins.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch batch admins" });
  }
};

exports.listClassAdmin = async (req, res) => {
  try {
    const admins = await classadmins.find({});
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch class admins" });
  }
};

exports.addBatch = async (req, res) => {
  console.log("Inside adminController: add batch function");
  const { year } = req.body;

  try {
    const existingBatch = await batches.findOne({ year });
    if (existingBatch) {
      return res.json("Batch already exists");
    }

    const newBatch = new batches({
      year: year,
    });

    await newBatch.save();

    res.status(201).json("Batch added successfully");
  } catch (error) {
    console.error("Error adding batch:", error);
    res
      .status(500)
      .json({ error: "Unable to add batch due to " + error.message });
  }
};

exports.listBatch = async (req, res) => {
  try {
    const batch = await batches.find({});

    return res.status(200).json(batch);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list batch due to " + error.message });
  }
};

exports.listBatchClass = async (req, res) => {
  console.log("Inside adminController: list batch class function");
  const { year } = req.query;

  try {
    if (!year) {
      return res.status(400).json({ error: "Year parameter is required" });
    }

    const classList = await classes
      .find({ batch: year })
      .sort({ classForm: 1 })
      .populate("batch");

    if (classList.length === 0) {
      return res.status(404).json({ error: "No classes found for this batch" });
    }

    res.status(200).json(classList);
  } catch (error) {
    res.status(500).json({ error: "Error fetching classes" });
  }
};

exports.addClass = async (req, res) => {
  console.log("Inside adminController: add class function");
  const { year, classForm } = req.body;

  try {
    const batch = await batches.findOne({ year });
    const existingClass = await classes.findOne({
      batch: batch._id,
      classForm,
    });
    if (existingClass) {
      return res.json("Class already exists");
    }

    const newClass = new classes({
      batch: batch._id,
      classForm: classForm,
    });

    await newClass.save();

    res.status(201).json("Class added successfully");
  } catch (error) {
    console.error("Error adding class:", error);
    res
      .status(500)
      .json({ error: "Unable to add class due to " + error.message });
  }
};

exports.listClass = async (req, res) => {
  try {
    const classForm = await classes.find({}).populate("batch");

    return res.status(200).json(classForm);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list class due to " + error.message });
  }
};

exports.listStudent = async (req, res) => {
  try {
    const student = await students.find({});

    return res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list class due to " + error.message });
  }
};

exports.addStudent = async (req, res) => {
  console.log("Inside adminController: add student function");
  const {
    name,
    year,
    classForm,
    password,
    email,
    contact,
    whatsapp,
    facebook,
    instagram,
    gender,
    occupation,
  } = req.body;

  try {
    const batch = await batches.findOne({ _id: year });
    const cls = await classes.findOne({ _id: classForm });
    console.log(batch, cls);

    const newStudent = new students({
      name: name,
      batch: batch._id,
      classForm: cls._id,
      password: password,
      email: email,
      contact: contact,
      whatsapp: whatsapp,
      facebook: facebook,
      instagram: instagram,
      gender: gender || null,
      occupation: occupation,
      profileImage: req.file ? req.file.filename : null,
    });

    await newStudent.save();

    res.status(200).json("Student added successfully");
  } catch (error) {
    console.error("Error adding Student:", error);
    res
      .status(500)
      .json({ error: "Unable to add Student due to " + error.message });
  }
};

exports.listStaff = async (req, res) => {
  try {
    const staff = await staffs.find({});

    return res.status(200).json(staff);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list staff due to " + error.message });
  }
};

exports.addStaff = async (req, res) => {
  console.log("Inside adminController: add staff function");
  const { name, staffType } = req.body;
  console.log(req.body);

  try {
    const newStaff = new staffs({
      name: name,
      staffType: staffType,
      profileImage: req.file ? req.file.filename : null,
    });

    await newStaff.save();

    res.status(200).json("Staff added successfully");
  } catch (error) {
    console.error("Error adding Staff:", error);
    res
      .status(500)
      .json({ error: "Unable to add Staff due to " + error.message });
  }
};

exports.listClassStudent = async (req, res) => {
  console.log("Inside adminController: list class student function");
  const { year, classForm } = req.query;
  console.log(year, "year", classForm, "classForm");

  try {
    if (!year || !classForm) {
      return res.status(400).json({ error: "Year and classForm are required" });
    }

    const studentList = await students
      .find({ batch: year, classForm: classForm })
      .populate("batch")
      .populate("classForm");

    if (!studentList || studentList.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(studentList);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Error fetching students" });
  }
};

exports.listJobs = async (req, res) => {
  try {
    const job = await jobs.find({});

    return res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list job due to " + error.message });
  }
};

exports.addJob = async (req, res) => {
  console.log("Inside adminController: add job function");
  const { job } = req.body;

  try {
    const existingJob = await jobs.findOne({ job });
    if (existingJob) {
      return res.json("Job already exists");
    }

    const newJob = new jobs({
      job: job,
    });

    await newJob.save();

    res.status(201).json("Job added successfully");
  } catch (error) {
    console.error("Error adding job:", error);
    res
      .status(500)
      .json({ error: "Unable to add job due to " + error.message });
  }
};

exports.getBatchAdmin = async (req, res) => {
  console.log("Inside adminController: get batchadmin function");
  try {
    const batchAdmin = await batchadmins
      .findOne({ batch: req.params.year })
      .lean();
    if (!batchAdmin) return res.status(404).json(null);
    res.status(200).json(batchAdmin);
  } catch (error) {
    res.status(500).json({ error: "Error fetching batch admin" });
  }
};

exports.getClassAdmin = async (req, res) => {
  console.log("Inside adminController: get classadmin function");
  const batch = req.params.year;
  const classForm = req.params.classForm;
  try {
    const classAdmin = await classadmins.findOne({
      batch: batch,
      classForm: classForm,
    });
    if (!classAdmin) return res.status(404).json(null);
    res.status(200).json(classAdmin);
  } catch (error) {
    res.status(500).json({ error: "Error fetching class admin" });
  }
};

exports.deleteJob = async (req, res) => {
  console.log("Inside adminController: delete job function");
  try {
    const jobId = req.params.jobId;

    const deletedJob = await jobs.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editJob = async (req, res) => {
  console.log("Inside adminController: edit job function");
  try {
    const jobId = req.params.jobId;
    const { job } = req.body;

    const existingJob = await jobs.findOne({ job });
    if (existingJob) {
      return res.status(406).json("Job already exists");
    }

    if (!job) {
      return res.status(400).json({ message: "Job name is required" });
    }

    const updatedJob = await jobs.findByIdAndUpdate(
      jobId,
      { job },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.error("Error editing job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteClass = async (req, res) => {
  console.log("Inside adminController: delete class function");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const classId = req.params.classId;

    const deletedStudents = await students
      .deleteMany({ classForm: classId })
      .session(session);
    const deletedClassAdmins = await classadmins
      .deleteMany({ classForm: classId })
      .session(session);
    const deletedClass = await classes
      .findByIdAndDelete(classId)
      .session(session);

    if (!deletedClass) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Class not found" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Class deleted successfully",
      deletedStudents: deletedStudents.deletedCount,
      deletedClassAdmins: deletedClassAdmins.deletedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editClass = async (req, res) => {
  console.log("Inside adminController: edit class function");

  try {
    const classId = req.params.classId;
    const { batch, classForm } = req.body;

    const existingClass = await classes.findOne({ batch, classForm });
    console.log(batch, classForm);

    if (existingClass) {
      console.log("existingClass", existingClass);
      return res.json("Class already exists");
    }

    if (!batch || !classForm) {
      return res.status(400).json({ message: "Year and class are required" });
    }

    const updatedClass = await classes.findByIdAndUpdate(
      classId,
      { classForm },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res
      .status(201)
      .json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    console.error("Error editing class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBatch = async (req, res) => {
  console.log("Inside adminController: delete batch function");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const batchId = req.params.batchId;
    const deletedClasses = await classes
      .deleteMany({ batch: batchId })
      .session(session);
    const deletedStudents = await students
      .deleteMany({ batch: batchId })
      .session(session);
    const deletedBatchAdmins = await batchadmins
      .deleteMany({ batch: batchId })
      .session(session);
    const deletedClassAdmins = await classadmins
      .deleteMany({ batch: batchId })
      .session(session);
    const deletedBatch = await batches
      .findByIdAndDelete(batchId)
      .session(session);

    if (!deletedBatch) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Batch not found" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message:
        "Batch, classes, students, batch admins, and class admins deleted successfully",
      deletedClasses: deletedClasses.deletedCount,
      deletedStudents: deletedStudents.deletedCount,
      deletedBatchAdmins: deletedBatchAdmins.deletedCount,
      deletedClassAdmins: deletedClassAdmins.deletedCount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting batch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editBatch = async (req, res) => {
  console.log("Inside adminController: edit batch function");

  try {
    const batchId = req.params.batchId;
    const { year } = req.body;
    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const existingBatch = await batches.findOne({ year });
    if (existingBatch) {
      return res.status(406).json("Batch already exists");
    }

    const updatedBatch = await batches.findByIdAndUpdate(
      batchId,
      { year },
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res
      .status(200)
      .json({ message: "Batch updated successfully", batch: updatedBatch });
  } catch (error) {
    console.error("Error editing batch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClassFormById = async (req, res) => {
  const cls = req.params.id;
  // const year = req.params.year;
  try {
    const classForm = await classes.findById(cls).populate("classForm");

    if (!classForm) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(classForm);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBatchById = async (req, res) => {
  try {
    const batch = await batches.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteStudent = async (req, res) => {
  console.log("Inside adminController: delete student function");
  try {
    const studentId = req.params.studentId;

    // Find student before deleting
    const student = await students.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete profile image if exists
    if (student.profileImage) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        student.profileImage
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting student image:", err);
        }
      });
    }

    // Delete student from database
    await students.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editStudent = async (req, res) => {
  console.log("Inside adminController: edit student function");
  const studentId = req.params.studentId;
  try {
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const {
      name,
      password,
      email,
      contact,
      whatsapp,
      facebook,
      instagram,
      gender,
      occupation,
    } = req.body;

    if (!name || !gender) {
      return res.status(400).json({ message: "Name and gender are required" });
    }

    let updateFields = {
      name: name.trim(),
      email: email ? email.trim() : "",
      contact:
        contact && contact !== "null" ? parseInt(contact, 10) || null : null,
      whatsapp:
        whatsapp && whatsapp !== "null" ? parseInt(whatsapp, 10) || null : null,
      facebook: facebook ? facebook.trim() : "",
      instagram: instagram ? instagram.trim() : "",
      gender,
      occupation: occupation ? occupation.trim() : "",
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedStudent = await students.findByIdAndUpdate(
      studentId,
      updateFields,
      { new: true, runValidators: true } // Ensures validation on update
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Error editing student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  console.log("Inside adminController: delete staff function");
  try {
    const staffId = req.params.staffId;

    // Find staff before deleting
    const staff = await staffs.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Delete profile image if exists
    if (staff.profileImage) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        staff.profileImage
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting staff image:", err);
        }
      });
    }

    // Delete staff from database
    await staffs.findByIdAndDelete(staffId);

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editStaff = async (req, res) => {
  console.log("Inside adminController: edit staff function");

  try {
    const staffId = req.params.staffId;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID is required" });
    }

    const { name, staffType } = req.body;

    if (!name || !staffType) {
      return res
        .status(400)
        .json({ message: "Name and staffType are required" });
    }

    let updateFields = {
      name: name.trim(),
      staffType: staffType,
    };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedStaff = await staffs.findByIdAndUpdate(staffId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    console.error("Error editing staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteBatchAdmin = async (req, res) => {
  console.log("Inside adminController: delete admin function");
  try {
    const adminId = req.params.adminId;

    const deletedAdmin = await batchadmins.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteClassAdmin = async (req, res) => {
  console.log("Inside adminController: delete admin function");
  try {
    const adminId = req.params.adminId;

    const deletedAdmin = await classadmins.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editBatchAdmin = async (req, res) => {
  console.log("Inside adminController: edit admin function");

  try {
    const adminId = req.params.adminId;
    const { password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      var pass = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await batchadmins.findByIdAndUpdate(
      adminId,
      { password: pass },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error("Error editing admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editClassAdmin = async (req, res) => {
  console.log("Inside adminController: edit admin function");

  try {
    const adminId = req.params.adminId;
    const { password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      var pass = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await classadmins.findByIdAndUpdate(
      adminId,
      { password: pass },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error("Error editing admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBatchByBatchAdmin = async (req, res) => {
  console.log("Inside admin controller get batch by batchadmin");
  try {
    const adminId = req.params.id;

    const batch = await batchadmins.findById({ _id: adminId });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClassByClassAdmin = async (req, res) => {
  console.log("Inside admin controller get class by classadmin");
  try {
    const adminId = req.params.id;

    const batch = await classadmins.findById({ _id: adminId });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.status(200).json(batch);
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ message: "Server error" });
  }
};
