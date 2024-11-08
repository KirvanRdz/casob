
const Invoice = require('../models/invoices');
// Middleware para verificar si la factura existe
const checkInvoiceExists = async (req, res, next) => {
  try {
    const id = req.params.id;
    const existInvoice = await Invoice.findById(id);
    if (!existInvoice) {
      return res.status(400).json({ msg: 'La factura no existe' });
    }
    req.invoice = existInvoice; // Guardar el registro existente en la solicitud
    next();
  } catch (error) {
    return res.status(500).json({ msg: 'Error al verificar la factura', error });
  }
};

module.exports = {
  checkInvoiceExists
};
