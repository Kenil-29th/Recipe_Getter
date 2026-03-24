const jwt = require('jsonwebtoken');//import JWT library used to create authentication token
const User = require('../models/User');


const generateToken = (id) => {//function that take user ID and return JWT token
  return jwt.sign({ id }, process.env.JWT_SECRET, {//create token from the secret key from the env file
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',//token expiry time default it is 7d
  });
};

const login = async (req, res, next) => {//controller for login
  try {
    const { email, password } = req.body;//extract email,password from th request body

    if (!email || !password) {//check if the field is field
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({//compare the password from the user password
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {//check if the user is Active or not
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact support.',
      });
    }

    const token = generateToken(user._id);//generate JWT token using user id

    res.status(200).json({//send response in Jon format
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const register = async (req, res, next) => {//controller for user reegistraton
  try {
    const { name, email, password, bio, role } = req.body;//extract field from user body

    // Only allow admin role to be set by an existing admin
    const assignedRole = role === 'admin' ? 'chef' : (role || 'chef');

    const user = await User.create({ name, email, password, bio, role: assignedRole });//create a new user in DB

    const token = generateToken(user._id);//generate token using user ID

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


const getMe = async (req, res, next) => {//controller to get current logged-in user
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user },//comes from auth middleware
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {//controller  to update user profile
  try {
    const { name, email, bio } = req.body;//extract the updated field
    const userId = req.user._id;//get logged in userID

    // Validation
    if (!name || !email) {//validation
      return res.status(400).json({
        success: false,
        message: 'Name and email are required.',
      });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already in use.',
      });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, bio },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
          createdAt: updatedUser.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, getMe, updateProfile };