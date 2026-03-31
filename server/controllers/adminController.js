import User from '../models/User.js';
import Issue from '../models/Issue.js';

// @desc    Get complete admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const inProgressIssues = await Issue.countDocuments({ status: 'progress' });
    const submittedIssues = await Issue.countDocuments({ status: 'submitted' });
    
    const usersCount = await User.countDocuments();
    
    const categoryBreakdown = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      totalIssues,
      resolvedRate: totalIssues === 0 ? 0 : Math.round((resolvedIssues / totalIssues) * 100),
      statusCounts: {
        resolved: resolvedIssues,
        progress: inProgressIssues,
        submitted: submittedIssues
      },
      usersCount,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
