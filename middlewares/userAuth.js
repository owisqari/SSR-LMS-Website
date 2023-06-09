const jwt = require("jsonwebtoken");
require("dotenv").config();

// verify token middleware
exports.verifyUser = (req, res, next) => {
  if (!req.cookies.access_token) {
    res.redirect("/instructor/login");
    return;
  }
  const token = req.cookies.access_token;
  if (!token) {
    res.redirect("/instructor/login");
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.redirect("/instructor/login");
    } else {
      res.locals.currentUser = data;
      res.locals.userId = data.userId;
      next();
    }
  });
};

exports.verifyStudent = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      res.locals.currentUser = data;
      res.locals.userId = data._id;
      res.locals.token = token;
      next();
    }
  });
};
