import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  authGoogle: { type: String, default: null },
  authFacebook: { type: String, default: null },
  authType: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  decks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Deck",
    },
  ],
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.authType !== "local") next();
    else {
      /* Generate a salt */
      const salt = await bcrypt.genSalt(10);
      /* Generate a password hash (salt + hash) */
      const passwordHashed = await bcrypt.hash(this.password, salt);
      /* Re-assign password hashed */
      this.password = passwordHashed;
      next();
    }
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

const User = mongoose.model("User", UserSchema);

export default User;
