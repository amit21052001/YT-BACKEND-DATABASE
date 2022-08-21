import { IncomingForm } from "formidable";
import { genSalt, hash, compare } from "bcrypt";
import { config } from "dotenv";
import { sign, verify } from "jsonwebtoken";
import { userModel } from "../models/User.model";
config();

export class AuthController {
  //signup
  signup(req, res) {
    const form = new IncomingForm();

    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res.status(500).json({
          msg: "Network Error, Failed to create Account, Please try again later..",
        });
      }
      const { username, email, password } = fields;
      const salt = await genSalt(15);
      const hashedPassword = await hash(password, salt);

      const newAcount = new userModel({
        username,
        email,
        password: hashedPassword,
      });
      try {
        const savedAccount = await newAcount.save();
        console.log(savedAccount);
        return res.status(201).json({ msg: "Account created successfully.." });
      } catch (error) {
        console.log(error);
        return res
          .status(404)
          .json({ status: "error", error: "Failed to create Account.." });
      }
    });
  }

  //signin
  signin(req, res) {
    const form = new IncomingForm();

    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res
          .status(500)
          .json({ msg: "Network Error: Failed to login.." });
      }

      const { account, password } = fields;

      const isAccountEmail = account.includes("@");
      //signin via email -->
      if (isAccountEmail) {
        const user = await userModel.findOne({ email: account });

        if (!user) {
          return res
            .status(404)
            .json({ msg: "Account With this Email does not exist.." });
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(404).json({ msg: "Invalid Password" });
        }

        const token_payload = {
          _id: user._id,
          username: user.username,
          email: user.email,
        };
        const token = sign(token_payload, process.env.cookie_secret, {
          expiresIn: "365d",
        });
        return res.status(200).json({ token });
      }

      //signin via username -->
      const user = await userModel.findOne({ username: account });
      if (!user) {
        return res
          .status(404)
          .json({ msg: "Account With this Username does not exist.." });
      }
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        return res.status(404).json({ msg: "Invalid Password" });
      }

      const token_payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };
      const token = sign(token_payload, process.env.cookie_secret, {
        expiresIn: "365d",
      });
      return res.status(200).json({ token });
    });
  }

  //change-Password
  forgetPassword(req, res) {
    const form = new IncomingForm();

    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res.status(404).json({ msg: "Network Error..." });
      }

      const { email, password } = fields;

      if (!email || !password) {
        return res
          .status(404)
          .json({ msg: "All Fields are requird to Reset Password..." });
      }

      const salt = await genSalt(15);
      const hashedPassword = await hash(password, salt);

      try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
          return res
            .status(404)
            .json({ msg: "Account with this email does not exists...." });
        }
        const updatedAccount = await userModel.findOneAndUpdate(
          { email: email },
          { $set: { password: hashedPassword } },
          { new: true }
        );
        return res
          .status(200)
          .json({ msg: "Password is successfully Changed..." });
      } catch (error) {
        return res.status(404).josn({ msg: "Failed to Update Password." });
      }
    });
  }
}
