const Joi = require("joi");

const registerSchema = Joi.object({
  nama: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .label("Nama Pengguna")
    .messages({
      "string.empty": "{{#label}} harus diisi yaa",
      "string.alphanum": "{{#label}} harus dalam bentuk alphanumeric saja",
      "string.min": "{{#label}} harus lebih dari 3 karakter",
      "string.max": "{{#label}} harus kurang dari 30 karakter",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{4,}$"
      )
    )
    .required()
    .label("Password Pengguna")
    .messages({
      "string.empty": "{{#label}} harus diisi yaa",
      "string.pattern.base":
        "{{#label}} harus diisi dengan minimal 1 huruf kecil, 1 huruf besar, 1 angka dan 1 simbol, dengan panjang minimal 4 karakter",
    }),
  jk: Joi.string()
    .valid("pria", "wanita")
    .required()
    .label("Jenis Kelamin")
    .messages({
      "string.empty": "{{#label}} harus diisi yaa",
      "any.only": "{{#label}} harus pria / wanita",
    }),

  password_confirmation: Joi.any()
    .equal(Joi.ref("password"))
    .label("Konfirmasi Password")
    .messages({ "any.only": "{{#label}} harus sama dengan password" }),
});

module.exports = registerSchema;
