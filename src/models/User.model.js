import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required to create account"],
    unique: [true, "Account with this username is already exist"],
  },
  email: {
    type: String,
    required: [true, "Email is required to create account"],
    unique: [true, "Account with this username is already exist"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "password should be atleast 8 character-long"],
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "videos",
    },
  ],
  //people that suscribe that channel
  subscribers: {
    type: Array,
    default: [],
  },
  //list of channel that user has subscribed to
  userSubscribedChannels: {
    type: Array,
    default: [],
  },
});

export const userModel = model("user", userSchema);
