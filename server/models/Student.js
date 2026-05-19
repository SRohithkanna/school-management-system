const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  rollNumber:  { type: String, required: true, unique: true },
  class:       { type: String, required: true },
  section:     { type: String, required: true },
  age:         { type: Number, required: true },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  email:       { type: String },
  phone:       { type: String },
  address:     { type: String },
  subjects:    [String],
  attendance:  { type: Number, default: 0, min: 0, max: 100 },
  grade:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);