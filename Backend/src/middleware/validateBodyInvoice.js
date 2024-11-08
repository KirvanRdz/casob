
const { body, param, validationResult } = require('express-validator');

// Validaciones para registrar factura
const validateBodyInvoice = [
  body('fecha_emision').notEmpty().withMessage('La fecha de emision es requerida.')
    .isDate().withMessage('La fecha de emision debe ser una fecha válida en formato YYYY-MM-DD.'),
  body('numero_factura').notEmpty().withMessage('El numero de factura es requerido'),
  body('proveedor').notEmpty().withMessage('El proveedor es requerido'),
  body('importe').notEmpty().withMessage('El importe es requerido').isNumeric().withMessage('El importe debe ser un valor numerico')
];


// Función para manejar resultados de validación
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.errors[0].msg, status:400 });
  }
  next();
};

module.exports = {
  validateBodyInvoice,
  checkValidationResult,
};
