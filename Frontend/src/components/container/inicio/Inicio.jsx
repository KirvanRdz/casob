import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'
import { getAllInvoices, createInvoice, updateDataInvoice, updateFileInvoice, deleteInvoiceById, validateInvoice } from '../../../api/api';
import { removeLocalStorage } from '../../../utils/remove_localstorage';

const InvoicePage = () => {
    const [invoices, setInvoices] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [currentInvoice, setCurrentInvoice] = useState({ id: null, fecha_emision: '', numero_factura: '', proveedor: '', importe: '', estatus: 'pendiente' });
    const [isEditing, setIsEditing] = useState(false);
    const [isValidated, setIsValidated] = useState(false); //Para saber si la factura está validada
    const [pdfFile, setPdfFile] = useState(null);
    const [xmlFile, setXmlFile] = useState(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState({});
    const [showModal, setShowModal] = useState(false);
    // Función para deshabilitar los botones de acción en la tabla cuando se está editando
    const [isTableDisabled, setIsTableDisabled] = useState(false); // variable para bloquear la tabla

    useEffect(() => {
        async function fetchData() {
            const invoiceData = await getAllInvoices(page, limit);
            if (invoiceData.status === 500) {
                removeLocalStorage();
                window.location.href = "/";
            } else {
                setInvoices(invoiceData.data);
                setPagination(invoiceData.pagination);
            }
        }
        fetchData();
    }, [page, limit]);

    // Función para cancelar la edición
    const cancelEdit = () => {
        resetForm(); // Reiniciar el formulario
        setIsEditing(false); // Desactivar el estado de edición
        setIsTableDisabled(false); // Habilitar la tabla nuevamente
    };

    // Función para cancelar el proceso de validación y cargar archivos
    const cancelValidation = () => {
        setIsValidated(false); // Desmarcar como validada la factura
        setIsTableDisabled(false); // Rehabilitar la tabla
        setPdfFile(null); // Limpiar el archivo PDF cargado
        setXmlFile(null); // Limpiar el archivo XML cargado
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentInvoice({ ...currentInvoice, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'pdf') setPdfFile(files[0]);
        if (name === 'xml') setXmlFile(files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fecha_emision', currentInvoice.fecha_emision);
        formData.append('numero_factura', currentInvoice.numero_factura);
        formData.append('proveedor', currentInvoice.proveedor);
        formData.append('importe', currentInvoice.importe);
        formData.append('estatus', 'pendiente');
        formData.append('pdf', pdfFile);
        formData.append('xml', xmlFile);

        const newInvoice = await createInvoice(formData);
        if (newInvoice.status === 200) {

            setIsTableDisabled(false);
            setInvoices([...invoices, newInvoice.data]);
            resetForm();
            alert(newInvoice.msg);
        } else {

            setIsTableDisabled(false); // Si la validación falla, reactivar la tabla
            alert(newInvoice.msg);
        }


    };

    const resetForm = () => {
        setCurrentInvoice({ id: null, fecha_emision: '', numero_factura: '', proveedor: '', importe: '', estatus: 'pendiente' });
        setPdfFile(null);
        setXmlFile(null);
        setIsValidated(false);
    };

    const validateCurrentInvoice = async () => {
        // Deshabilitar la tabla mientras se valida
        setIsTableDisabled(true);
        const validationResponse = await validateInvoice(currentInvoice);
        if (validationResponse.status === 200) {
            setIsValidated(true);
            setIsTableDisabled(true); // Deshabilitar la tabla tras validación exitosa
            alert(validationResponse.msg);
        } else {

            setIsTableDisabled(false); // Si la validación falla, reactivar la tabla
            alert(validationResponse.msg);
        }
    };
    const updateDataCurrentInvoice = async () => {

        const updateDataResponse = await updateDataInvoice(currentInvoice, currentInvoice.id);
        if (updateDataResponse.status === 200) {
            setInvoices(invoices.map(inv => (inv.id === currentInvoice.id ? currentInvoice : inv)));
            alert(updateDataResponse.msg);
        } else {

            alert(updateDataResponse.msg);
        }
    };

    const updateFileCurrentInvoice = async () => {
        if (!pdfFile || !xmlFile) {
            alert('Debes seleccionar los dos archivos pdf y xml');
            return;
        }

        const formData = new FormData();
        formData.append('numero_factura', currentInvoice.numero_factura);
        formData.append('pdf', pdfFile);
        formData.append('xml', xmlFile);
        const updateFileResponse = await updateFileInvoice(formData, currentInvoice.id);
        if (updateFileResponse.status === 200) {
            setInvoices(invoices.map(inv => (inv.id === currentInvoice.id ? currentInvoice : inv)));
            resetForm(); // Reiniciar el formulario
            setIsEditing(false); // Desactivar el estado de edición
            setIsTableDisabled(false); // Habilitar la tabla nuevamente
            alert(updateFileResponse.msg);
            
        } else {

            alert(updateFileResponse.msg);
        }
    };


    const editInvoice = (invoice) => {
        // Formatear la fecha para asegurarse de que sea compatible con el input de tipo "date"
        const formattedDate = invoice.fecha_emision ? new Date(invoice.fecha_emision).toISOString().split('T')[0] : '';

        // Establecer la factura actual en el estado, incluyendo la fecha formateada
        setCurrentInvoice({ ...invoice, fecha_emision: formattedDate });
        setIsEditing(true);
        setIsTableDisabled(true);

    };


    const handleDownload = (url) => {

    };

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < pagination.totalPages) setPage(page + 1);
    };

    const handelDeleteModal = async (invoice) => {
        setInvoiceToDelete(invoice);
        setShowModal(true);
    }

    const handleDeleteClick = async () => {
       
        setShowModal(false)
        const deleteResponse = await deleteInvoiceById(invoiceToDelete.id);
        if (deleteResponse.status === 200) {
            setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete.id));
            alert(deleteResponse.msg);
        } else {

            alert(deleteResponse.msg);
        }
        

    };

    return (
        <div className="invoice-page">
            <h1>Gestión de Facturas</h1>

            {/* Formulario para agregar/editar facturas */}
            <form onSubmit={handleSubmit} className="invoice-form">
                <div className="form-group">
                    <label>Fecha Emisión</label>
                    <input
                        type="date"
                        name="fecha_emision"
                        value={currentInvoice.fecha_emision}
                        onChange={handleChange}
                        required
                        disabled={isValidated}
                    />
                </div>
                <div className="form-group">
                    <label>Número Factura</label>
                    <input
                        type="text"
                        name="numero_factura"
                        value={currentInvoice.numero_factura}
                        onChange={handleChange}
                        required
                        placeholder="Número de factura"
                        disabled={isValidated}
                    />
                </div>
                <div className="form-group">
                    <label>Proveedor</label>
                    <input
                        type="text"
                        name="proveedor"
                        value={currentInvoice.proveedor}
                        onChange={handleChange}
                        required
                        placeholder="Proveedor"
                        disabled={isValidated}
                    />
                </div>
                <div className="form-group">
                    <label>Importe</label>
                    <input
                        type="number"
                        name="importe"
                        value={currentInvoice.importe}
                        onChange={handleChange}
                        required
                        placeholder="Importe"
                        disabled={isValidated}
                    />
                </div>
                <div className="form-group">
                    <label>Estatus</label>
                    <select
                        name="estatus"
                        value={currentInvoice.estatus}
                        onChange={handleChange}
                        disabled
                    >
                        <option value="pendiente">pendiente</option>
                        <option value="pagado">rechazado</option>
                        <option value="cancelado">aprobado</option>
                    </select>
                </div>
                {isEditing && (
                    <button type="button" onClick={updateDataCurrentInvoice} className="btn-submit">
                        Actualizar Datos Factura
                    </button>
                )}
                {/* Botón de validar y cargar archivos */}

                {!isValidated && !isEditing && (
                    <button type="button" onClick={validateCurrentInvoice} className="btn-submit">
                        Validar Factura
                    </button>
                )}

                {(isValidated || isEditing) && (
                    <>
                        <div className="form-group">
                            <label>Cargar PDF</label>
                            <input type="file" name="pdf" accept=".pdf" onChange={handleFileChange} required />
                        </div>
                        <div className="form-group">
                            <label>Cargar XML</label>
                            <input type="file" name="xml" accept=".xml" onChange={handleFileChange} required />
                        </div>

                        {isValidated && (
                            <button type="submit" className="btn-submit">
                                Registrar Factura
                            </button>
                        )}
                        {/* Botón de cancelar */}
                        {isEditing && (
                            <div>
                                <button type="button" onClick={updateFileCurrentInvoice} className="btn-submit">
                                    Actualizar Archivos
                                </button><br />
                                <button type="button" onClick={cancelEdit} className="btn-cancel">
                                    Cancelar Edición
                                </button>
                            </div>
                        )}
                        {isValidated && !isEditing && (
                            <button type="button" onClick={cancelValidation} className="btn-cancel">
                                Cancelar
                            </button>
                        )}
                    </>
                )}
            </form>


            {/* Lista de facturas */}
            <div className="invoice-list">
                <h2>Facturas Registradas</h2>
                {invoices.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha Emisión</th>
                                <th>Número Factura</th>
                                <th>Proveedor</th>
                                <th>Importe</th>
                                <th>Estatus</th>
                                <th>PDF</th>
                                <th>XML</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td>{new Date(invoice.fecha_emision).toLocaleDateString()}</td>
                                    <td>{invoice.numero_factura}</td>
                                    <td>{invoice.proveedor}</td>
                                    <td>${invoice.importe}</td>
                                    <td>{invoice.estatus}</td>
                                    <td>
                                        <button className="button-link" onClick={() => handleDownload(invoice.url_pdf)}>
                                            Ver PDF
                                        </button>
                                    </td>
                                    <td>
                                        <button className="button-link" onClick={() => handleDownload(invoice.url_xml)}>
                                            Ver XML
                                        </button>
                                    </td>

                                    <td>
                                        {/* Botones de acción deshabilitados si estamos editando */}
                                        <button
                                            onClick={() => editInvoice(invoice)}
                                            className="btn-edit"
                                            disabled={isTableDisabled}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handelDeleteModal(invoice)}
                                            className="btn-delete"
                                            disabled={isTableDisabled}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay facturas registradas.</p>
                )}

                {/* Controles de paginación */}
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={page === 1 || isTableDisabled}>
                        Anterior
                    </button>
                    <span>Página {pagination.currentPage} de {pagination.totalPages}</span>
                    <button onClick={handleNextPage} disabled={page === pagination.totalPages || pagination.totalPages == 0 || isTableDisabled}>
                        Siguiente
                    </button>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Estas seguro de eliminar la factura  #{invoiceToDelete.numero_factura} ?

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>

                    <Button variant="danger" onClick={handleDeleteClick}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default InvoicePage;
