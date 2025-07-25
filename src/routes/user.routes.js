const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { validate } = require("../middlewares/validate.middleware");
const { registerValidationRules, loginValidationRules, updateValidationRules } = require("../validators/user.validator");
const { authenticate } = require("../middlewares/authenticate.middleware");

router.get("/:user_id", authenticate, userController.getUsers);
router.post("/", authenticate, registerValidationRules(), validate, userController.createUser);
router.get("/edit/:user_id", authenticate, userController.getUser);
router.put("/:user_id", authenticate, updateValidationRules(), validate, userController.updateUser);
router.delete("/:user_id", authenticate, userController.deleteUser);

router.post("/login", loginValidationRules(), validate, userController.login);
router.post("/register", registerValidationRules(), validate, userController.register);
router.post("/logout", userController.logout);
router.get("/auth/me", authenticate, async (req, res) => {
  const user = req.user;
  delete user.password;
  res.json(user);
});

module.exports = router;
