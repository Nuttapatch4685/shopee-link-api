const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.errors[0].msg });
  }
  next();
};

module.exports = { validate };
// const { validationResult } = require("express-validator");

// const validateRequest = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       errors: errors.array().map((err) => ({ field: err.param, message: err.msg })),
//     });
//   }
//   next();
// };

// module.exports = { validateRequest };
