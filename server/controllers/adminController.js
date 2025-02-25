const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const admins = require("../models/adminSchema");
const batches = require("../models/batchSchema");
const classes = require("../models/classSchema");
const batchadmins = require("../models/batchAdminSchema");
const classadmins = require("../models/classAdminSchema");
const students = require("../models/studentSchema");
const staffs = require("../models/staffSchema");
const sponsors = require("../models/sponsorSchema");
const updates = require("../models/updateSchema");
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
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

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

exports.userLogin = async (req, res) => {
  console.log("Inside userLogin function");
  try {
    const { email, password } = req.body;

    // Find student by email
    let student = await students.findOne({ email });
    if (!student) {
      student = await updates.findOne({ email });
      if (!student) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // Check password
    let isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      isMatch = password == student.password;
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, userId: student._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.userSignup = async (req, res) => {
  console.log("Inside userSignup function");
  const { name, email, password, year, classForm, gender } = req.body;
  try {
    const existingStudent = await students.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const batch = await batches.findOne({ year: year });
    const cls = await classes.findOne({
      batch: batch._id,
      classForm: classForm,
    });

    if (!batch || !cls) {
      return res.status(400).json({ message: "Invalid batch or class" });
    }

    const newStudent = new updates({
      name: name,
      email: email,
      password: password,
      batch: batch._id,
      classForm: cls._id,
      gender: gender,
    });

    await newStudent.save();

    // Generate JWT token
    const token = jwt.sign({ id: newStudent._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({ message: "Signup successful", token, userId: newStudent._id });
  } catch (error) {
    console.error("Signup error:", error);
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
    const existingAdmin = await classadmins.findOne({ batch: year, classForm });
    if (existingAdmin) {
      return res
        .status(406)
        .json("An admin already exists for this batch and class.");
    }

    const emailExists = await classadmins.findOne({ email });
    if (emailExists) {
      return res.status(406).json("Admin with this email already exists.");
    }

    const newAdmin = new classadmins({
      email: email,
      password: password,
      batch: year,
      classForm: classForm,
      adminType: "classadmin",
    });

    await newAdmin.save();

    res.status(200).json("Admin added successfully.");
  } catch (err) {
    console.error("Error adding admin:", err);
    res
      .status(500)
      .json({ error: "Unable to add admin due to: " + err.message });
  }
};

exports.dashStats = async (req, res) => {
  try {
    const { batch, cls } = req.query;

    const [
      classAdminCount,
      batchAdminCount,
      staffCount,
      studentCount,
      batchCount,
      classCount,
      classCountByBatch,
      studentCountByClass,
      updateCount,
      sponsorCount,
      jobCount,
    ] = await Promise.all([
      classadmins.countDocuments(),
      batchadmins.countDocuments(),
      staffs.countDocuments(),
      students.countDocuments(),
      batches.countDocuments(),
      classes.countDocuments(),
      batch ? classes.countDocuments({ batch: batch }) : 0,
      cls ? students.countDocuments({ batch: batch, classForm: cls }) : 0,
      updates.countDocuments(),
      sponsors.countDocuments(),
      jobs.countDocuments(),
    ]);

    const adminCount = classAdminCount + batchAdminCount;

    res.json({
      adminCount,
      staffCount,
      studentCount,
      batchCount,
      classCount,
      classCountByBatch,
      studentCountByClass,
      updateCount,
      sponsorCount,
      jobCount,
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

    batch.sort((a, b) => Number(a.year) - Number(b.year));
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

    const classList = await classes.find({ batch: year }).populate("batch");

    if (classList.length === 0) {
      return res.status(404).json({ error: "No classes found for this batch" });
    }

    classList.sort((a, b) => {
      const parseClassName = (name) => {
        const match = name.match(/^(\d+)\s*([a-zA-Z]*)$/);
        return match ? [parseInt(match[1]), match[2].toLowerCase()] : [0, ""];
      };

      const [numA, letterA] = parseClassName(a.classForm);
      const [numB, letterB] = parseClassName(b.classForm);

      if (numA !== numB) return numA - numB;
      return letterA.localeCompare(letterB);
    });

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
      profileImage: req.file ? req.file.filename : null,
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

    classForm.sort((a, b) => {
      const matchA = a.classForm.match(/^(\d+)(\D*)$/);
      const matchB = b.classForm.match(/^(\d+)(\D*)$/);

      const numA = parseInt(matchA[1], 10);
      const numB = parseInt(matchB[1], 10);

      if (numA !== numB) return numA - numB;

      const letterA = matchA[2].toLowerCase();
      const letterB = matchB[2].toLowerCase();

      return letterA.localeCompare(letterB);
    });

    return res.status(200).json(classForm);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list class due to " + error.message });
  }
};

exports.listStudent = async (req, res) => {
  try {
    const student = await students
      .find({})
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

    return res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list student due to " + error.message });
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

    if (email) {
      const existingStudent = await students.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

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
      .json({ error: "Please fill name and gender fields before submitting" });
  }
};

exports.listStaff = async (req, res) => {
  console.log("Inside adminController: list staff function");
  try {
    const staff = await staffs
      .find({})
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

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

exports.listSponsor = async (req, res) => {
  try {
    const sponsor = await sponsors
      .find({})
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

    return res.status(200).json(sponsor);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list sponsor due to " + error.message });
  }
};

exports.addSponsor = async (req, res) => {
  console.log("Inside adminController: add sponsor function");
  const { name } = req.body;

  try {
    const newSponsor = new sponsors({
      name: name,
      profileImage: req.file ? req.file.filename : null,
    });

    await newSponsor.save();

    res.status(200).json("Sponsor added successfully");
  } catch (error) {
    console.error("Error adding Sponsor:", error);
    res
      .status(500)
      .json({ error: "Unable to add Sponsor due to " + error.message });
  }
};

exports.listClassStudent = async (req, res) => {
  console.log("Inside adminController: list class student function");
  const { year, classForm } = req.query;

  try {
    if (!year || !classForm) {
      return res.status(400).json({ error: "Year and classForm are required" });
    }

    const studentList = await students
      .find({ batch: year, classForm: classForm })
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 })
      .populate("batch")
      .populate("classForm");

    if (!studentList || studentList.length === 0) {
      return res.status(200).json([]);
    }

    const groupedStudents = {
      male: [],
      female: [],
      other: [],
    };

    studentList.forEach((student) => {
      if (student.gender === "male") {
        groupedStudents.male.push(student);
      } else if (student.gender === "female") {
        groupedStudents.female.push(student);
      } else {
        groupedStudents.other.push(student);
      }
    });

    const sortedGroupedStudents = [
      ...groupedStudents.male,
      ...groupedStudents.female,
      ...groupedStudents.other,
    ];

    console.log(sortedGroupedStudents);

    res.status(200).json(sortedGroupedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Error fetching students" });
  }
};

exports.listJobs = async (req, res) => {
  try {
    const job = await jobs
      .find({})
      .collation({ locale: "en", strength: 1 })
      .sort({ job: 1 });

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

    const existingJob = await jobs.find({ job });
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

    const classToDelete = await classes.findById(classId).session(session);
    if (!classToDelete) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Class not found" });
    }

    if (classToDelete.profileImage) {
      const classImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        classToDelete.profileImage
      );
      fs.unlink(classImagePath, (err) => {
        if (err) {
          console.error("Error deleting class image:", err);
        }
      });
    }

    const studentsToDelete = await students.find({ classForm: classId }).session(session);

    studentsToDelete.forEach((student) => {
      if (student.profileImage) {
        const studentImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          student.profileImage
        );
        fs.unlink(studentImagePath, (err) => {
          if (err) {
            console.error(`Error deleting image for student ${student._id}:`, err);
          }
        });
      }
    });

    const deletedStudents = await students.deleteMany({ classForm: classId }).session(session);

    const deletedClassAdmins = await classadmins.deleteMany({ classForm: classId }).session(session);

    await classes.findByIdAndDelete(classId).session(session);

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
    const { year, classForm } = req.body;

    const existingClass = await classes.findOne({ batch: year, classForm });

    if (existingClass) {
      return res.json("Class already exists");
    }

    if (!year || !classForm) {
      return res.status(400).json({ message: "Year and class are required" });
    }

    let updateFields = {
      classForm: classForm,
    };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedClass = await classes.findByIdAndUpdate(
      classId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
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

    const classesToDelete = await classes.find({ batch: batchId }).session(session);
    const studentsToDelete = await students.find({ batch: batchId }).session(session);

    classesToDelete.forEach((classItem) => {
      if (classItem.profileImage) {
        const classImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          classItem.profileImage
        );
        fs.unlink(classImagePath, (err) => {
          if (err) {
            console.error(`Error deleting class image ${classItem._id}:`, err);
          }
        });
      }
    });

    studentsToDelete.forEach((student) => {
      if (student.profileImage) {
        const studentImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          student.profileImage
        );
        fs.unlink(studentImagePath, (err) => {
          if (err) {
            console.error(`Error deleting student image ${student._id}:`, err);
          }
        });
      }
    });

    const deletedClasses = await classes.deleteMany({ batch: batchId }).session(session);
    const deletedStudents = await students.deleteMany({ batch: batchId }).session(session);
    const deletedBatchAdmins = await batchadmins.deleteMany({ batch: batchId }).session(session);
    const deletedClassAdmins = await classadmins.deleteMany({ batch: batchId }).session(session);
    const deletedBatch = await batches.findByIdAndDelete(batchId).session(session);

    if (!deletedBatch) {
      await session.abortTransaction();
      session.endSession();
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

exports.getIdByBatch = async (req, res) => {
  const year = req.params.year;

  try {
    const batch = await batches.find({ year: year });

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

    const student = await students.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

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
      maskNumber,
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
      maskNumber: maskNumber,
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

    const staff = await staffs.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

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

exports.deleteSponsor = async (req, res) => {
  console.log("Inside adminController: delete sponsor function");
  try {
    const sponsorId = req.params.sponsorId;

    const sponsor = await sponsors.findById(sponsorId);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    if (sponsor.profileImage) {
      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        sponsor.profileImage
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting sponsor image:", err);
        }
      });
    }

    await sponsors.findByIdAndDelete(sponsorId);

    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editSponsor = async (req, res) => {
  console.log("Inside adminController: edit sponsor function");
  const sponsorId = req.params.sponsorId;
  try {
    if (!sponsorId) {
      return res.status(400).json({ message: "Sponsor ID is required" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    let updateFields = {
      name: name.trim(),
    };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedSponsor = await sponsors.findByIdAndUpdate(
      sponsorId,
      updateFields,
      { new: true, runValidators: true } // Ensures validation on update
    );

    if (!updatedSponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    res.status(200).json({
      message: "Sponsor updated successfully",
      sponsor: updatedSponsor,
    });
  } catch (error) {
    console.error("Error editing sponsor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

exports.fetchUser = async (req, res) => {
  console.log("Inside admin controller: fetch user function");
  try {
    const userId = req.params.userId;
    let student = await students.findById(userId);

    if (!student) {
      student = await updates.findById(userId);
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.listUpdates = async (req, res) => {
  try {
    const student = await updates.find({});

    return res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Unable to list updates due to " + error.message });
  }
};

exports.addUpdate = async (req, res) => {
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

exports.editUpdate = async (req, res) => {
  console.log("Inside adminController: edit update function");
  const studentId = req.params.studentId;

  try {
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const {
      batch,
      classForm,
      name,
      email,
      contact,
      whatsapp,
      facebook,
      instagram,
      gender,
      occupation,
      maskNumber,
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
      maskNumber: maskNumber,
      batch: batch,
      classForm: classForm,
    };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    let studentUpdated = await updates.findByIdAndUpdate(
      studentId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!studentUpdated) {
      studentUpdated = new updates({
        ...updateFields,
        _id: studentId,
      });
      await studentUpdated.save();
    }

    res.status(200).json({
      message: "Updated successfully",
      update: studentUpdated,
    });
  } catch (error) {
    console.error("Error editing student:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUpdate = async (req, res) => {
  console.log("Inside adminController: delete update function");
  try {
    const studentId = req.params.studentId;

    const student = await updates.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

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

    await updates.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Update deleted successfully" });
  } catch (error) {
    console.error("Error deleting update:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addStudentUpdate = async (req, res) => {
  console.log("Inside adminController: add student update function");
  const {
    studentId,
    name,
    batch,
    classForm,
    password,
    email,
    contact,
    whatsapp,
    facebook,
    instagram,
    gender,
    occupation,
    maskNumber,
    profileImage,
  } = req.body;

  try {
    const student = await students.findById(studentId);

    let updateFields = {
      name: name.trim(),
      email: email ? email.trim() : "",
      contact:
        contact && contact !== "null" ? parseInt(contact, 10) || null : null,
      whatsapp:
        whatsapp && whatsapp !== "null" ? parseInt(whatsapp, 10) || null : null,
      facebook: facebook ? facebook.trim() : "",
      instagram: instagram ? instagram.trim() : "",
      gender: gender || null,
      occupation: occupation ? occupation.trim() : "",
      maskNumber: maskNumber,
      profileImage: profileImage,
      batch: batch,
      classForm: classForm,
      password: password,
    };

    if (student) {
      const updatedStudent = await students.findByIdAndUpdate(
        studentId,
        updateFields,
        { new: true, runValidators: true }
      );
    } else {
      const newStudent = new students({
        _id: studentId,
        ...updateFields,
      });

      await newStudent.save();
    }

    await updates.findByIdAndDelete(studentId);

    res.status(200).json("Student added successfully");
  } catch (error) {
    console.error("Error adding Student:", error);
    res
      .status(500)
      .json({ error: "Unable to add Student due to " + error.message });
  }
};
