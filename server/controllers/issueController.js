import Issue from '../models/Issue.js';

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({})
      .populate('reportedBy', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an issue
// @route   POST /api/issues
// @access  Private
export const createIssue = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      aiCategory, 
      aiPriority, 
      aiSuggestion 
    } = req.body;

    let locationStr = req.body.location;
    let location = {};
    if (locationStr) {
      if (typeof locationStr === 'string') {
        location = JSON.parse(locationStr);
      } else {
        location = locationStr;
      }
    }

    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map((file) => file.path); // Cloudinary URL
    } else if (req.body.photos) {
      // In case they just pass strings/URLs
      photos = Array.isArray(req.body.photos) ? req.body.photos : [req.body.photos];
    }

    const issue = new Issue({
      title,
      description,
      category,
      location,
      photos,
      reportedBy: req.user._id,
      aiCategory,
      aiPriority,
      aiSuggestion
    });

    const createdIssue = await issue.save();
    res.status(201).json(createdIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name profilePhoto')
      .populate('comments');
      
    if (issue) {
      res.json(issue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update single issue (Admin)
// @route   PUT /api/issues/:id
// @access  Private/Admin
export const updateIssue = async (req, res) => {
  try {
    const { status, priority } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (issue) {
      issue.status = status || issue.status;
      issue.priority = priority || issue.priority;
      
      if (status === 'resolved' && issue.status !== 'resolved') {
        issue.resolvedAt = Date.now();
      }

      const updatedIssue = await issue.save();
      res.json(updatedIssue);
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an issue (Admin)
// @route   DELETE /api/issues/:id
// @access  Private/Admin
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (issue) {
      await Issue.deleteOne({ _id: issue._id });
      res.json({ message: 'Issue removed' });
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote an issue
// @route   POST /api/issues/:id/upvote
// @access  Private
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (issue) {
      const alreadyUpvoted = issue.upvotes.find(
        (r) => r.toString() === req.user._id.toString()
      );

      if (alreadyUpvoted) {
        return res.status(400).json({ message: 'Issue already upvoted' });
      }

      issue.upvotes.push(req.user._id);
      await issue.save();
      res.status(201).json({ message: 'Issue upvoted' });
    } else {
      res.status(404).json({ message: 'Issue not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's issues
// @route   GET /api/issues/my
// @access  Private
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
