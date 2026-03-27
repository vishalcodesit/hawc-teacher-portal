const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuthUser',
      required: true,
      unique: true, // Enforces 1-1 relationship
    },
    university_name: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    year_joined: {
      type: Number,
      required: [true, 'Year joined is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear(), 'Year cannot be in the future'],
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    designation: {
      type: String,
      trim: true,
      enum: ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor', 'Other'],
      default: 'Lecturer',
    },
    subject_specialization: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
