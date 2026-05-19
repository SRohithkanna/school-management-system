const Student = require('../models/Student');

exports.getAllStudents = async (req, res) => {
  try {
    const { search, class: cls, section, gender } = req.query;
    let query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } }
    ];
    if (cls)     query.class = cls;
    if (section) query.section = section;
    if (gender)  query.gender = gender;
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Roll number already exists' });
    res.status(400).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const byClass = await Student.aggregate([
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    const byGender = await Student.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);
    const avgAttendance = await Student.aggregate([
      { $group: { _id: null, avg: { $avg: '$attendance' } } }
    ]);
    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      total,
      byClass,
      byGender,
      avgAttendance: avgAttendance[0]?.avg?.toFixed(1) || 0,
      recentStudents
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};