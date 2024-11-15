const Invoice = require('../models/invoices');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Configuración de almacenamiento de `multer`
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../uploads/invoices'));
	},
	filename: (req, file, cb) => {
		const { numero_factura } = req.body;
		const originalNameWithoutExt = path.parse(file.originalname).name; // nombre sin la extensión
		const uniqueSuffix = `${numero_factura}-${originalNameWithoutExt}-${Date.now()}`;
		cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
	}
});



const upload = multer({ storage: storage }).fields([{ name: 'pdf' }, { name: 'xml' }]);

const createInvoice = async (req, res, next) => {
	try {

		upload(req, res, async function (err) {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: 'Error al subir archivos', status:500 });
			}

			const pdfPath = req.files['pdf'][0].path;
			const xmlPath = req.files['xml'][0].path;

			// Guardar la nueva factura con las rutas de PDF y XML
			const newInvoice = new Invoice(pdfPath, xmlPath, 'pendiente',null, req.body);
			const result = await newInvoice.saveInvoice();

			return res.status(200).json({ msg: 'Factura creada correctamente', data: result, status:200 });
		});
	} catch (err) {
		console.log(err)
		next(err);
	}
};

const responseValidateInvoice = async (req, res, next) => {

	try {

		//Validamos si ya existe la factura
		const invoice = new Invoice(null, null, null, null, req.body);
		const invoiceExists = await invoice.findOne();
		if (invoiceExists) {
			return res.status(400).json({ msg: 'La factura ya existe.' , status:400 });
		}
		return res.status(200).json({ msg: 'OK', status:200  });

	} catch (err) {
		console.log(err)
		next(err);
	}


};

const updateDataInvoice = async (req, res, next) => {

	try {
		const id = req.params.id

		//validamos si si existe la factura a actualizar
		const existInvoice = await Invoice.findById(id);
		if (!existInvoice) {
			return res.status(400).json({ msg: 'La factura no existe',status:400 });
		}


		//Validamos si ya existe la factura con los datos a actualizar
		const invoice = new Invoice(null, null, null, id, req.body);
		const invoiceExists = await invoice.findOne();
		if (invoiceExists && invoiceExists.id !== parseInt(id)) {
			return res.status(400).json({ msg: 'La factura ya existe.',status:400 });
		}

		const updateInvoice = await invoice.updateById();
		if (!updateInvoice) {
			return res.status(400).json({ msg: 'No se actualizaron los datos', status:400 });
		}
		return res.status(200).json({ msg: 'datos actualizados',data:updateInvoice,status:200 });

	} catch (err) {
		console.log(err)
		next(err);
	}


};


const updateFileInvoice = async (req, res, next) => {
	try {

		upload(req, res, async function (err) {
			if (err) {
				return res.status(500).json({ msg: 'Error al subir archivos', status:500});
			}
			const id = req.params.id
			const existInvoice = req.invoice

			// Eliminar los archivos antiguos si existen
			if (existInvoice.url_pdf) {
				try {
					fs.unlinkSync(existInvoice.url_pdf);  // Eliminar el archivo PDF antiguo
				} catch (err) {
					console.error('Error al eliminar archivo PDF:', err);
				}
			}
			if (existInvoice.url_xml) {
				try {
					fs.unlinkSync(existInvoice.url_xml);  // Eliminar el archivo XML antiguo
				} catch (err) {
					console.error('Error al eliminar archivo XML:', err);
				}
			}

			// Guardamos las nuevas rutas de los archivos
			const pdfPath = req.files['pdf'][0].path;
			const xmlPath = req.files['xml'][0].path;

			// Actualizamos la factura con las nuevas URLs de los archivos
			const newInvoice = await Invoice.updateFilebyId(id, pdfPath, xmlPath);

			if (!newInvoice) {
				return res.status(400).json({ msg: 'No fue posible actualizar las url de las facturas, vuelve a cargar los archivos',status:400 });
			}

			return res.status(200).json({ msg: 'Factura actualizada correctamente', data: newInvoice,status:200 });
		});
	} catch (err) {
		console.log(err)
		next(err);
	}
};

const deleteInvoice = async (req, res, next) => {
	try {

		const id = req.params.id
		const existInvoice = req.invoice

		// Directorio de destino para los archivos eliminados
		const deletedFolder = path.join(__dirname, '../uploads/invoices_deleted');
		if (!fs.existsSync(deletedFolder)) {
			fs.mkdirSync(deletedFolder);  // Crear la carpeta si no existe
		}

		let pdfPath = existInvoice.url_pdf;
		let xmlPath = existInvoice.url_xml;
		
		// Mover los archivos PDF y XML a la carpeta 'invoice_deleted'
		if (existInvoice.url_pdf) {
			const pdfFileName = path.basename(existInvoice.url_pdf);
			pdfPath = path.join(deletedFolder, pdfFileName);
			try {
				fs.renameSync(existInvoice.url_pdf, pdfPath); // Mueve el archivo PDF
			} catch (err) {
				console.error('Error al mover archivo PDF:', err);
			}
		}

		if (existInvoice.url_xml) {
			const xmlFileName = path.basename(existInvoice.url_xml);
			xmlPath = path.join(deletedFolder, xmlFileName);
			try {
				fs.renameSync(existInvoice.url_xml, xmlPath); // Mueve el archivo XML
			} catch (err) {
				console.error('Error al mover archivo XML:', err);
			}
		}

		// Actualizamos la factura con las nuevas URLs de los archivos
		const deleteInvoice = await Invoice.deleteById(id,pdfPath, xmlPath);

		if (!deleteInvoice) {
			return res.status(400).json({ msg: 'No fue posible eliminar la factura', status:400 });
		}

		return res.status(200).json({ msg: 'Factura eliminada correctamente', data: deleteInvoice,status:200 });

	} catch (err) {
		console.log(err)
		next(err);
	}
};

const getAllInvoice = async (req, res, next) => {
	try {
		const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
		const limit = parseInt(req.query.limit) || 10; // Número de resultados por página, por defecto 10
		const offset = (page - 1) * limit;
		
		// Obtener facturas con paginación
		const invoices= await Invoice.findAll({ limit, offset });
		// Modificar las facturas para solo enviar el nombre del archivo
		const modifiedInvoices = invoices.map(invoice => {
			// Extraer solo el nombre del archivo (sin la ruta completa)
			const pdfFilename = invoice.url_pdf ? path.basename(invoice.url_pdf) : null;
			const xmlFilename = invoice.url_xml ? path.basename(invoice.url_xml) : null;
	  
			return {
			  ...invoice,
			  url_pdf: pdfFilename,  // Aquí agregamos solo el nombre del archivo PDF
			  url_xml: xmlFilename   // Aquí agregamos solo el nombre del archivo XML
			};
		  });
		// Contar total de facturas para calcular el número total de páginas
		const totalInvoices = await Invoice.countAll();
		const totalPages = Math.ceil(totalInvoices / limit);

		res.status(200).json({
			data: modifiedInvoices,
			pagination: {
			  currentPage: page,
			  totalPages: totalPages,
			  totalItems: totalInvoices,
			  itemsPerPage: limit
			}
		  });

	} catch (err) {
		console.log(err)
		next(err);
	}
};

module.exports = {	createInvoice, responseValidateInvoice, 
					updateDataInvoice, updateFileInvoice, 
					deleteInvoice, getAllInvoice };