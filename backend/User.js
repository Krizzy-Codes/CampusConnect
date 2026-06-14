const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    college: {
      type: String,
      required: true
    },
    hostel: {
      type: String,
      default: ''
    },
    branch: {
  type: String,
  default: ''
},
semester: {
  type: Number,
  default: 1
},
profilePic: {
  type: String,
  default: ''
},
bio: {
  type: String,
  default: ''
}
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);