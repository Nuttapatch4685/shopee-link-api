const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { validate } = require("../middlewares/validate.middleware");
const { registerValidationRules, loginValidationRules, updateValidationRules } = require("../validators/user.validator");

router.get("/:user_id", userController.getUsers);
router.post("/", registerValidationRules(), validate, userController.createUser);
router.get("/edit/:user_id", userController.getUser);
router.put("/:user_id", updateValidationRules(), validate, userController.updateUser);
router.delete("/:user_id", userController.deleteUser);

router.post("/login", loginValidationRules(), validate, userController.login);
router.post("/register", registerValidationRules(), validate, userController.register);

module.exports = router;
