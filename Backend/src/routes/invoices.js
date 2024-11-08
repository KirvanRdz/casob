const express = require('express');

const { createInvoice, responseValidateInvoice,updateDataInvoice,updateFileInvoice, deleteInvoice, getAllInvoice } = require('../controller/invoices');
const {validateBodyInvoice, checkValidationResult} = require('../middleware/validateBodyInvoice');
const {checkInvoiceExists} = require('../middleware/checkInvoiceExists');
const { verificarToken } =require('../middleware/autenticacion');

const router = express.Router();

router.post('/validate',verificarToken,validateBodyInvoice,checkValidationResult, responseValidateInvoice); // validamos que no exista factura
router.post('/upload',verificarToken, createInvoice); // cargar los archivos
router.put('/:id',verificarToken,validateBodyInvoice,checkValidationResult, updateDataInvoice); // Actualizar una Factura
router.put('/upload/:id',verificarToken,checkInvoiceExists, updateFileInvoice); // Actualizar archivos
router.delete('/:id',verificarToken,checkInvoiceExists, deleteInvoice); // Eliminar Factura
router.get('/', verificarToken,getAllInvoice); // Obtener facturas por paginacion
module.exports = router;