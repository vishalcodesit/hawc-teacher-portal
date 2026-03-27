const AuthUser = require('../models/AuthUser');
const Teacher = require('../models/Teacher');

// @desc    Create teacher (pushes data into auth_user + teachers)
// @route   POST /api/teachers
// @access  Private
const createTeacher = async (req, res) => {
  let createdUser = null;

  try {
    const {
      // auth_user fields
      email,
      first_name,
      last_name,
      password,
      phone,
      // teacher fields
      university_name,
      gender,
      year_joined,
      department,
      designation,
      subject_specialization,
    } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name || !password || !university_name || !gender || !year_joined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: email, first_name, last_name, password, university_name, gender, year_joined.',
      });
    }

    // Check if user already exists
    const existingUser = await AuthUser.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    // Step 1: Create auth_user
    createdUser = await AuthUser.create({
      email, first_name, last_name, password, phone,
    });

    // Step 2: Create teacher linked to auth_user
    const teacher = await Teacher.create({
      user_id: createdUser._id,
      university_name,
      gender,
      year_joined,
      department,
      designation,
      subject_specialization,
    });

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully.',
      data: {
        user: {
          id: createdUser._id,
          email: createdUser.email,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          phone: createdUser.phone,
        },
        teacher: {
          id: teacher._id,
          user_id: teacher.user_id,
          university_name: teacher.university_name,
          gender: teacher.gender,
          year_joined: teacher.year_joined,
          department: teacher.department,
          designation: teacher.designation,
          subject_specialization: teacher.subject_specialization,
        },
      },
    });
  } catch (error) {
    // Manual rollback: if teacher creation failed but user was already created, delete it
    if (createdUser) {
      await AuthUser.findByIdAndDelete(createdUser._id).catch(() => {});
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all teachers with user details (joined)
// @route   GET /api/teachers
// @access  Private
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user_id', 'email first_name last_name phone createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate(
      'user_id',
      'email first_name last_name phone createdAt'
    );

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete teacher and associated user
// @route   DELETE /api/teachers/:id
// @access  Private
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    await AuthUser.findByIdAndDelete(teacher.user_id);
    await Teacher.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Teacher and associated user deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all auth_users
// @route   GET /api/teachers/users
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await AuthUser.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTeacher, getAllTeachers, getTeacher, deleteTeacher, getAllUsers };