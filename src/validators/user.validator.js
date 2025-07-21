const { body } = require("express-validator");

const registerValidationRules = () => [
  body("username").trim().isLength({ min: 6, max: 20 }).withMessage("ชื่อผู้ใช้งานต้องมีความยาว 6-20 ตัวอักษร").isAlphanumeric().withMessage("ชื่อผู้ใช้งานไม่ถูกต้อง"),

  body("phone")
    .matches(/^0[0-9]{9}$/)
    .withMessage("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .matches(/[a-z]/)
    .withMessage("รหัสผ่านต้องประกอบด้วย a-z")
    .matches(/[A-Z]/)
    .withMessage("รหัสผ่านต้องประกอบด้วย A-Z")
    .matches(/[0-9]/)
    .withMessage("รหัสผ่านต้องประกอบด้วย 0-9"),
];

const updateValidationRules = () => [
  body("username").trim().isLength({ min: 6, max: 20 }).withMessage("ชื่อผู้ใช้งานต้องมีความยาว 6-20 ตัวอักษร").isAlphanumeric().withMessage("ชื่อผู้ใช้งานไม่ถูกต้อง"),

  body("phone")
    .matches(/^0[0-9]{9}$/)
    .withMessage("รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง"),

  body("credit").notEmpty().withMessage("กรุณาระบบข้อมูลเครดิต"),
];

const loginValidationRules = () => [
  body("username").trim().isLength({ min: 6, max: 20 }).withMessage("ชื่อผู้ใช้งานต้องมีความยาว 6-20 ตัวอักษร").isAlphanumeric().withMessage("ชื่อผู้ใช้งานไม่ถูกต้อง"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
    .matches(/[a-z]/)
    .withMessage("รหัสผ่านต้องประกอบด้วย a-z")
    .matches(/[A-Z]/)
    .withMessage("รหัสผ่านต้องประกอบด้วย A-Z")
    .matches(/[0-9]/)
    .withMessage("รหัสผ่านต้องประกอบด้วย 0-9"),
];
module.exports = {
  registerValidationRules,
  updateValidationRules,
  loginValidationRules,
};
