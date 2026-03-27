const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getAllTeachers,
  getTeacher,
  deleteTeacher,
  getAllUsers,
} = require('../controllers/teacherController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/', createTeacher);
router.get('/', getAllTeachers);
router.get('/users', getAllUsers);
router.get('/:id', getTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;
