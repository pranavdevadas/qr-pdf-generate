import bcrypt from "bcrypt";
import User from "../model/user.js";
import { sql, config } from "../config/db.js";

const usercontroller = {
  getLogin: (req, res, next) => {
    try {
      if (req.session.user) {
        return res.redirect("/");
      }
      res.render("login");
    } catch (error) {
      next(error);
    }
  },

  postLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        req.flash("alert", "Please enter the details.");
        res.redirect("/login");
      }

      const result =
        await sql.query`SELECT * FROM Users WHERE email = ${email}`;

      const user = result.recordset[0];

      if (!user) {
        req.flash("alert", "User not exist. Please register.");
        res.redirect("/login");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        req.session.user = { id: user.id, email: user.email, name: user.name };
        req.flash("success", "Login successfully");
        res.redirect("/");
      } else {
        req.flash("alert", "Incorrect email or password");
        res.redirect("/login");
      }
    } catch (error) {
      next(error);
    }
  },

  getRegister: (req, res, next) => {
    try {
      if (req.session.user) {
        res.redirect("/");
      }
      res.render("Register");
    } catch (error) {
      next(error);
    }
  },

  postRegister: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        req.flash("alert", "Fill all the details");
        res.redirect("/register");
      }

      const existingMail = await User.findOne({ where: { email } });
      if (existingMail) {
        req.flash("alert", "Email already exists! Please login.");
        res.redirect("/register");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      req.session.user = { id: user.id, email: user.email, name: user.name };
      req.flash("success", "Registered successfully");
      res.redirect("/");
    } catch (error) {
      next(error);
    }
  },

  getHome: async (req, res, next) => {
    try {
      const pool = await sql.connect(config);
      const query = `
        SELECT * FROM Vouchers
        ORDER BY gendate DESC;
      `;
      const result = await pool.query(query);
      res.render("home", {
        vouchers: result.recordset,
      });
    } catch (error) {
      next(error);
    }
  },

  notFound: (req, res) => {
    res.render("404Error");
  },

  logout: (req, res, next) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          req.flash("alert", "Something went wrong. Please try again.");
          return res.redirect("/");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
      });
    } catch (error) {
      next(error);
    }
  },
};

export default usercontroller;
