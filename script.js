document.addEventListener('DOMContentLoaded', () => {
    const nuevaObraForm = document.getElementById('nuevaObraForm');
    const obrasContainer = document.getElementById('obrasContainer');
    const addActividadBtn = document.getElementById('addActividadBtn');
    const actividadesContainer = document.getElementById('actividadesContainer');
    const STORAGE_KEY = 'proyectosConstruccion';

    let proyectos = [];
    let actividadCounter = 0; 

    function cargarProyectos() {
        const proyectosGuardados = localStorage.getItem(STORAGE_KEY);
        if (proyectosGuardados) {
            proyectos = JSON.parse(proyectosGuardados);
        }
        mostrarProyectos();
    }

    function guardarProyectos() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(proyectos));
    }

    function calcularDiferencia(actividadRow) {
        const valorTotalContratadoInput = actividadRow.querySelector('.actividad-valor-total-contratado');
        const valorTotalEnSitioInput = actividadRow.querySelector('.actividad-valor-total-sitio');
        const diferenciaInput = actividadRow.querySelector('.actividad-diferencia');

        const valorContratado = parseFloat(valorTotalContratadoInput.value) || 0;
        const valorEnSitio = parseFloat(valorTotalEnSitioInput.value) || 0;
        const diferencia = valorContratado - valorEnSitio;
        
        diferenciaInput.value = diferencia.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    }

    function addActividadRow() {
        actividadCounter++;
        const actividadRow = document.createElement('div');
        actividadRow.classList.add('actividad-row', 'form-section');
        actividadRow.innerHTML = `
            <hr>
            <h5>Actividad ${actividadCounter}</h5>
            <div>
                <label for="actividadNombre-${actividadCounter}">ACTIVIDAD:</label>
                <input type="text" id="actividadNombre-${actividadCounter}" name="actividadNombre" class="actividad-nombre" required>
            </div>
            <fieldset>
                <legend>Medidas Contratadas</legend>
                <div class="actividad-field-group">
                    <div>
                        <label for="actividadUnidadContratada-${actividadCounter}">Unidad:</label>
                        <input type="text" id="actividadUnidadContratada-${actividadCounter}" name="actividadUnidadContratada" class="actividad-unidad-contratada" placeholder="Ej: m2, ml, und">
                    </div>
                    <div>
                        <label for="actividadCantidadContratada-${actividadCounter}">Cantidad:</label>
                        <input type="number" id="actividadCantidadContratada-${actividadCounter}" name="actividadCantidadContratada" class="actividad-cantidad-contratada" min="0" step="any">
                    </div>
                    <div>
                        <label for="actividadValorTotalContratado-${actividadCounter}">Valor Total (€):</label>
                        <input type="number" id="actividadValorTotalContratado-${actividadCounter}" name="actividadValorTotalContratado" class="actividad-valor-total-contratado" min="0" step="0.01">
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Medidas en Sitio</legend>
                 <div class="actividad-field-group">
                    <div>
                        <label for="actividadUnidadEnSitio-${actividadCounter}">Unidad:</label>
                        <input type="text" id="actividadUnidadEnSitio-${actividadCounter}" name="actividadUnidadEnSitio" class="actividad-unidad-sitio" placeholder="Ej: m2, ml, und">
                    </div>
                    <div>
                        <label for="actividadCantidadEnSitio-${actividadCounter}">Cantidad:</label>
                        <input type="number" id="actividadCantidadEnSitio-${actividadCounter}" name="actividadCantidadEnSitio" class="actividad-cantidad-sitio" min="0" step="any">
                    </div>
                    <div>
                        <label for="actividadValorTotalEnSitio-${actividadCounter}">Valor Total (€):</label>
                        <input type="number" id="actividadValorTotalEnSitio-${actividadCounter}" name="actividadValorTotalEnSitio" class="actividad-valor-total-sitio" min="0" step="0.01">
                    </div>
                </div>
            </fieldset>
            <div>
                <label for="actividadDiferencia-${actividadCounter}">DIFERENCIA (€):</label>
                <input type="text" id="actividadDiferencia-${actividadCounter}" name="actividadDiferencia" class="actividad-diferencia" readonly>
            </div>
            <button type="button" class="btn-eliminar-actividad">Eliminar Actividad</button>
        `;
        actividadesContainer.appendChild(actividadRow);

        actividadRow.querySelector('.actividad-valor-total-contratado').addEventListener('input', () => calcularDiferencia(actividadRow));
        actividadRow.querySelector('.actividad-valor-total-sitio').addEventListener('input', () => calcularDiferencia(actividadRow));
        
        actividadRow.querySelector('.btn-eliminar-actividad').addEventListener('click', () => {
            actividadRow.remove();
        });

        calcularDiferencia(actividadRow); 
    }

    addActividadBtn.addEventListener('click', addActividadRow);

    function mostrarProyectos() {
        obrasContainer.innerHTML = ''; 
        if (proyectos.length === 0) {
            obrasContainer.innerHTML = '<p>No hay obras registradas. Agrega una nueva obra para comenzar.</p>';
            return;
        }

        proyectos.forEach((obra) => {
            const obraCard = document.createElement('div');
            obraCard.classList.add('obra-card');
            obraCard.dataset.id = obra.id;

            const corteInicio = obra.corteFechaInicio ? new Date(obra.corteFechaInicio).toLocaleDateString() : 'N/A';
            const corteFin = obra.corteFechaFin ? new Date(obra.corteFechaFin).toLocaleDateString() : 'N/A';
            const contratoInicio = obra.contratoInfo.fechaInicioContrato ? new Date(obra.contratoInfo.fechaInicioContrato).toLocaleDateString() : 'N/A';
            const contratoFin = obra.contratoInfo.fechaFinalContrato ? new Date(obra.contratoInfo.fechaFinalContrato).toLocaleDateString() : 'N/A';

            let actividadesHtml = '<h4>Actividades del Contrato:</h4>';
            if (obra.contratoInfo.actividades && obra.contratoInfo.actividades.length > 0) {
                actividadesHtml += '<ul>';
                obra.contratoInfo.actividades.forEach(act => {
                    actividadesHtml += `
                        <li>
                            <strong>${act.nombreActividad}</strong>
                            <p>Contratado: ${act.medidasContratadas.cantidad} ${act.medidasContratadas.unidad} - ${parseFloat(act.medidasContratadas.valorTotal).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                            <p>En Sitio: ${act.medidasEnSitio.cantidad} ${act.medidasEnSitio.unidad} - ${parseFloat(act.medidasEnSitio.valorTotal).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                            <p>Diferencia: ${act.diferencia}</p>
                        </li>`;
                });
                actividadesHtml += '</ul>';
            } else {
                actividadesHtml += '<p>No hay actividades registradas para este contrato.</p>';
            }

            obraCard.innerHTML = `
                <h3>${obra.nombreObra}</h3>
                <p class="info-item"><strong>Constructora:</strong> ${obra.constructora || 'N/A'}</p>
                <p class="info-item"><strong>Dirección:</strong> ${obra.direccion || 'N/A'}</p>
                <p class="info-item"><strong>Supervisor:</strong> ${obra.supervisor || 'N/A'}</p>
                <p class="info-item"><strong>Cortes:</strong> ${corteInicio} - ${corteFin}</p>
                
                <h4>Personal Clave:</h4>
                <p class="info-item"><strong>Director:</strong> ${obra.directorObra.nombre || 'N/A'} (Cel: ${obra.directorObra.celular || 'N/A'}, Email: ${obra.directorObra.correo || 'N/A'})</p>
                <p class="info-item"><strong>Residente:</strong> ${obra.residenteObra.nombre || 'N/A'} (Cel: ${obra.residenteObra.celular || 'N/A'}, Email: ${obra.residenteObra.correo || 'N/A'})</p>
                <p class="info-item"><strong>Maestro:</strong> ${obra.maestroObra.nombre || 'N/A'} (Cel: ${obra.maestroObra.celular || 'N/A'}, Email: ${obra.maestroObra.correo || 'N/A'})</p>
                <p class="info-item"><strong>SISO:</strong> ${obra.siso?.nombre || 'N/A'} (Cel: ${obra.siso?.celular || 'N/A'}, Email: ${obra.siso?.correo || 'N/A'})</p>

                <h4>Información del Contrato:</h4>
                <p class="info-item"><strong>Contrato N°:</strong> ${obra.contratoInfo.numeroContrato || 'N/A'}</p>
                <p class="info-item"><strong>Inicio Contrato:</strong> ${contratoInicio}</p>
                <p class="info-item"><strong>Fin Contrato:</strong> ${contratoFin}</p>
                ${actividadesHtml}
                
                <div class="actions">
                    <button class="btn-eliminar" data-id="${obra.id}">Eliminar</button>
                </div>
            `;
            obrasContainer.appendChild(obraCard);
        });

        document.querySelectorAll('.btn-eliminar').forEach(button => {
            button.addEventListener('click', handleEliminarObra);
        });
    }

    nuevaObraForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const actividades = [];
        const actividadRows = actividadesContainer.querySelectorAll('.actividad-row');
        actividadRows.forEach(row => {
            const nombreActividad = row.querySelector('.actividad-nombre').value;
            const unidadContratada = row.querySelector('.actividad-unidad-contratada').value;
            const cantidadContratada = parseFloat(row.querySelector('.actividad-cantidad-contratada').value) || 0;
            const valorTotalContratado = parseFloat(row.querySelector('.actividad-valor-total-contratado').value) || 0;
            const unidadEnSitio = row.querySelector('.actividad-unidad-sitio').value;
            const cantidadEnSitio = parseFloat(row.querySelector('.actividad-cantidad-sitio').value) || 0;
            const valorTotalEnSitio = parseFloat(row.querySelector('.actividad-valor-total-sitio').value) || 0;
            const diferencia = row.querySelector('.actividad-diferencia').value; 

            if (nombreActividad) { 
                actividades.push({
                    nombreActividad,
                    medidasContratadas: { unidad: unidadContratada, cantidad: cantidadContratada, valorTotal: valorTotalContratado },
                    medidasEnSitio: { unidad: unidadEnSitio, cantidad: cantidadEnSitio, valorTotal: valorTotalEnSitio },
                    diferencia 
                });
            }
        });

        const nuevaObra = {
            id: Date.now(),
            constructora: formData.get('constructora'),
            nombreObra: formData.get('nombreObra'),
            direccion: formData.get('direccionObra'),
            supervisor: formData.get('supervisorObra'),
            corteFechaInicio: formData.get('fechaCorteInicio'),
            corteFechaFin: formData.get('fechaCorteFin'),
            directorObra: {
                nombre: formData.get('directorNombre'),
                celular: formData.get('directorCelular'),
                correo: formData.get('directorCorreo')
            },
            residenteObra: {
                nombre: formData.get('residenteNombre'),
                celular: formData.get('residenteCelular'),
                correo: formData.get('residenteCorreo')
            },
            maestroObra: {
                nombre: formData.get('maestroNombre'),
                celular: formData.get('maestroCelular'),
                correo: formData.get('maestroCorreo')
            },
            siso: {
                nombre: formData.get('sisoNombre'),
                celular: formData.get('sisoCelular'),
                correo: formData.get('sisoCorreo')
            },
            contratoInfo: {
                numeroContrato: formData.get('contratoNumero'),
                fechaInicioContrato: formData.get('contratoFechaInicio'),
                fechaFinalContrato: formData.get('contratoFechaFinal'),
                actividades: actividades
            }
        };

        proyectos.push(nuevaObra);
        guardarProyectos();
        mostrarProyectos();
        nuevaObraForm.reset();
        actividadesContainer.innerHTML = ''; 
        actividadCounter = 0; 
    });

    function handleEliminarObra(event) {
        const obraId = parseInt(event.target.dataset.id);
        if (confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
            proyectos = proyectos.filter(p => p.id !== obraId);
            guardarProyectos();
            mostrarProyectos();
            alert('Obra eliminada con éxito.');
        }
    }

    cargarProyectos();
});