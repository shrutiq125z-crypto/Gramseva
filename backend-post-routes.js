// ADD THESE POST ROUTES TO YOUR EXISTING BACKEND
// These routes handle the POST requests with action fields from the frontend

// @route   POST /api/users/profile
// @desc    Handle profile operations (get, update, delete) via POST with action field
// @access  Private
router.post('/profile', authenticateUser, async (req, res) => {
  try {
    const { action, userId, ...profileData } = req.body;
    const currentUserId = req.user._id;

    switch (action) {
      case 'get':
        // Get current user profile
        const user = await User.findById(currentUserId);
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.status(200).json({
          success: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNo: user.phoneNo,
            role: user.role,
            gender: user.gender,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
        break;

      case 'update':
        // Update current user profile
        const { username, phoneNo, email, role, gender, address } = profileData;

        // Check if username, email, or phoneNo already exists for other users
        const existingUser = await User.findOne({
          _id: { $ne: currentUserId },
          $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email: email.toLowerCase() }] : []),
            ...(phoneNo ? [{ phoneNo }] : [])
          ]
        });

        if (existingUser) {
          let field = '';
          if (existingUser.username === username) field = 'username';
          else if (existingUser.email === email?.toLowerCase()) field = 'email';
          else if (existingUser.phoneNo === phoneNo) field = 'phone number';
          
          return res.status(400).json({
            success: false,
            message: `User with this ${field} already exists`
          });
        }

        // Prepare update data
        const updateData = {};
        if (username) updateData.username = username;
        if (phoneNo) updateData.phoneNo = phoneNo;
        if (email) updateData.email = email.toLowerCase();
        if (role) updateData.role = role;
        if (gender) updateData.gender = gender;
        if (address) updateData.address = address;

        const updatedUser = await User.findByIdAndUpdate(
          currentUserId,
          updateData,
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Profile updated successfully',
          user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phoneNo: updatedUser.phoneNo,
            role: updatedUser.role,
            gender: updatedUser.gender,
            address: updatedUser.address,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
          }
        });
        break;

      case 'delete':
        // Delete current user account
        const deletedUser = await User.findByIdAndDelete(currentUserId);

        if (!deletedUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'Account deleted successfully'
        });
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid action. Use: get, update, or delete'
        });
    }
  } catch (error) {
    console.error('Profile operation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users
// @desc    Handle user operations (getAll) via POST with action field
// @access  Private (Admin)
router.post('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { action, page = 1, limit = 10, role, search } = req.body;

    if (action === 'getAll') {
      // Build filter object
      const filter = {};
      if (role) filter.role = role;
      if (search) {
        filter.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNo: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(filter);

      res.status(200).json({
        success: true,
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.role,
          gender: user.gender,
          address: user.address,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Use: getAll'
      });
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/:id
// @desc    Handle user operations (getById, update, delete) via POST with action field
// @access  Private (Admin)
router.post('/:id', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { action, currentUserId, ...userData } = req.body;
    const targetUserId = req.params.id;

    switch (action) {
      case 'getById':
        // Get user by ID
        const user = await User.findById(targetUserId).select('-password');

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.status(200).json({
          success: true,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNo: user.phoneNo,
            role: user.role,
            gender: user.gender,
            address: user.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
        break;

      case 'update':
        // Update user by ID
        const { username, phoneNo, email, role, gender, address } = userData;

        // Check if user exists
        const existingUser = await User.findById(targetUserId);
        if (!existingUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        // Check if username, email, or phoneNo already exists for other users
        const duplicateUser = await User.findOne({
          _id: { $ne: targetUserId },
          $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email: email.toLowerCase() }] : []),
            ...(phoneNo ? [{ phoneNo }] : [])
          ]
        });

        if (duplicateUser) {
          let field = '';
          if (duplicateUser.username === username) field = 'username';
          else if (duplicateUser.email === email?.toLowerCase()) field = 'email';
          else if (duplicateUser.phoneNo === phoneNo) field = 'phone number';
          
          return res.status(400).json({
            success: false,
            message: `User with this ${field} already exists`
          });
        }

        // Prepare update data
        const updateData = {};
        if (username) updateData.username = username;
        if (phoneNo) updateData.phoneNo = phoneNo;
        if (email) updateData.email = email.toLowerCase();
        if (role) updateData.role = role;
        if (gender) updateData.gender = gender;
        if (address) updateData.address = address;

        const updatedUser = await User.findByIdAndUpdate(
          targetUserId,
          updateData,
          { new: true, runValidators: true }
        );

        res.status(200).json({
          success: true,
          message: 'User updated successfully',
          user: {
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phoneNo: updatedUser.phoneNo,
            role: updatedUser.role,
            gender: updatedUser.gender,
            address: updatedUser.address,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
          }
        });
        break;

      case 'delete':
        // Delete user by ID
        // Prevent admin from deleting themselves
        if (targetUserId === currentUserId) {
          return res.status(400).json({
            success: false,
            message: 'You cannot delete your own account'
          });
        }

        const deletedUser = await User.findByIdAndDelete(targetUserId);

        if (!deletedUser) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        res.status(200).json({
          success: true,
          message: 'User deleted successfully'
        });
        break;

      default:
        res.status(400).json({
          success: false,
          message: 'Invalid action. Use: getById, update, or delete'
        });
    }
  } catch (error) {
    console.error('User operation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/users/admin/add
// @desc    Add new user (admin only) - updated to handle action field
// @access  Private (Admin)
router.post('/admin/add', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { action, currentUserId, ...userData } = req.body;
    const { username, phoneNo, email, password, role, gender, address } = userData;

    if (action === 'add') {
      // Validation
      if (!username || !phoneNo || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, phone number, email, and password are required'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { phoneNo },
          { username }
        ]
      });

      if (existingUser) {
        let field = '';
        if (existingUser.email === email.toLowerCase()) field = 'email';
        else if (existingUser.phoneNo === phoneNo) field = 'phone number';
        else if (existingUser.username === username) field = 'username';
        
        return res.status(400).json({
          success: false,
          message: `User with this ${field} already exists`
        });
      }

      // Create new user
      const user = new User({
        username,
        phoneNo,
        email: email.toLowerCase(),
        password,
        role: role || 'villager',
        gender: gender || 'prefer not to say',
        address: address || {}
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phoneNo: user.phoneNo,
          role: user.role,
          gender: user.gender,
          address: user.address,
          createdAt: user.createdAt
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid action. Use: add'
      });
    }
  } catch (error) {
    console.error('Add user error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
