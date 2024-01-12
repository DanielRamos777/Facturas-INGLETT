// archivo scr\js\lista.js


var listaFacturas = JSON.parse(localStorage.getItem('listaFacturas')) || [];
var contadorFacturas = 1;

document.getElementById("facturaForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var area = document.getElementById("area").value;
    var fecha = document.getElementById("fecha").value;
    var serie = document.getElementById("serie").value;
    var cliente = document.getElementById("cliente").value;
    var moneda = document.getElementById("moneda").value;
    var observacion = document.getElementById("observacion").value;
    var descripcion = document.getElementById("descripcion").value;
    var subtotal = parseFloat(document.getElementById("subtotal").value);
    
    var igv = subtotal * 0.18;
    var total = subtotal + igv;

    var detraccion = document.getElementById("detraccion").value;
    var comentarios = document.getElementById("comentarios").value;

    var montoDetraccion = calcularMontoDetraccion(total, detraccion);
    var montoADepositar = total - montoDetraccion;

    var facturaId = pad(contadorFacturas++, 5);

    function pad(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    var factura = {
        id: facturaId,
        area: area,
        serie: serie,
        cliente: cliente,
        fecha: fecha,
        observacion: observacion,
        descripcion: descripcion,
        subtotal: subtotal.toFixed(2),
        igv: igv.toFixed(2),
        total: total.toFixed(2),
        detraccion: detraccion,
        monto_depositar: montoADepositar.toFixed(2),
        comentarios: comentarios
    };

    listaFacturas.push(factura);
    localStorage.setItem('listaFacturas', JSON.stringify(listaFacturas));

    actualizarListaFacturas();
    alert("Factura registrada con éxito. ID: " + facturaId);
});

function actualizarListaFacturas() {
    var facturaTable = document.getElementById("facturaTable");
    var tbody = facturaTable.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    listaFacturas.forEach(function (factura) {
        var newRow = tbody.insertRow();
        newRow.insertCell(0).innerText = factura.id;
        newRow.insertCell(1).innerText = factura.area;
        newRow.insertCell(2).innerText = factura.serie;
        newRow.insertCell(3).innerText = factura.cliente;
        newRow.insertCell(4).innerText = factura.fecha;
        newRow.insertCell(5).innerText = factura.observacion;
        newRow.insertCell(6).innerText = factura.descripcion;
        var subtotalCell = newRow.insertCell(7);
        subtotalCell.innerText = (factura.moneda === "sol" ? "S/" : "$") + " " + factura.subtotal;
        var igvCell = newRow.insertCell(8);
        igvCell.innerText = (factura.moneda === "sol" ? "S/" : "$") + " " + factura.igv;
        var totalCell = newRow.insertCell(9);
        totalCell.innerText = (factura.moneda === "sol" ? "S/" : "$") + " " + factura.total;
        newRow.insertCell(10).innerText = factura.monto_depositar;
        newRow.insertCell(11).innerText = factura.comentarios;
    });
    guardarFacturasEnServidor();
}

function calcularMontoDetraccion(monto, detraccion) {
    if (detraccion === "0%") {
        return 0;
    }

    var porcentaje = parseFloat(detraccion.replace('%', ''));
    return monto * (porcentaje / 100);
}

actualizarListaFacturas();

function guardarFacturasEnServidor() {
    // Realizar una solicitud POST al servidor para guardar las facturas
    fetch('/guardarFacturas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listaFacturas)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al guardar las facturas en el servidor.');
        }
        return response.text();
    })
    .then(message => {
        console.log(message);
    })
    .catch(error => {
        console.error(error);
    });
}

function guardarLocalmente(contenido, rutaArchivo) {
    // Guardar localmente en el archivo JSON en scr\files\facturas\facturas.json
    fs.writeFile(rutaArchivo, contenido, 'utf8', (err) => {
        if (err) {
            console.error(err);
            // Manejar el error según sea necesario
        } else {
            console.log('Facturas guardadas localmente en ' + rutaArchivo);
        }
    });
}