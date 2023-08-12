document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem('Id', '0');
    fetchCustomer();
});

var num = 1;
let totalTable = 0;
function AgregaConcepto() {

    if (document.getElementById("txtCantidad").value == "" || document.getElementById("txtPrecio").value == "") {
        alertCustomer("warning", "Por favor digital una cantidad y un precio.");
        return;
    }

    let cantidad = document.getElementById("txtCantidad").value;
    let precio = document.getElementById("txtPrecio").value;
    let btnEliminar = `<button class="btn btn-outline-danger btn-sm" onclick="eliminarFila(this,'${parseFloat(cantidad) * parseFloat(precio)}')">x</button>`;

    let table = document.getElementById("tablaDetalleFactura");
    let tr = document.createElement("tr");
    let tdCount = document.createElement("td");
    let tdCantidad = document.createElement("td");
    let tdPrecio = document.createElement("td");
    let tdButton = document.createElement("td");

    tr.appendChild(tdCount);
    tr.appendChild(tdCantidad);
    tr.appendChild(tdPrecio);
    tr.appendChild(tdButton);

    tdCount.innerHTML = num;
    tdCantidad.innerHTML = cantidad;
    tdPrecio.innerHTML = parseFloat(cantidad) * parseFloat(precio); 
    tdButton.innerHTML = btnEliminar;
    table.appendChild(tr);

    document.getElementById("txtItebis").value = '18.00';
     
    let precioPorCantidad = parseFloat(cantidad) * parseFloat(precio); 
    totalTable = parseFloat(totalTable) + parseFloat(precioPorCantidad); 

    let itebis = (parseFloat(totalTable) * parseFloat(0.18)) - parseFloat(totalTable);
        itebis = parseFloat(totalTable) + parseFloat(itebis);
    let sumaTotal = parseFloat(totalTable) + parseFloat(itebis);
    document.getElementById("txtTotal").value = parseFloat(sumaTotal).toFixed(2);
    document.getElementById("txtSubTotal").value = totalTable.toFixed(2);

    document.getElementById("txtCantidad").value = '';
    document.getElementById("txtPrecio").value = '';

    num++;
}

function eliminarFila(value,precio) {
    var fila = value.parentNode.parentNode;
    fila.parentNode.removeChild(fila);

    totalTable = parseFloat(totalTable) - parseFloat(precio);

    let itebis = (parseFloat(totalTable) * parseFloat(0.18)) - parseFloat(totalTable);
    itebis = parseFloat(totalTable) + parseFloat(itebis);
   let sumaTotal = parseFloat(totalTable) + parseFloat(itebis);
    document.getElementById("txtTotal").value = parseFloat(sumaTotal).toFixed(2);
    document.getElementById("txtSubTotal").value = totalTable.toFixed(2);

    document.getElementById("txtItebis").value = totalTable == 0 ? '': '18.00';
}

async function fetchCustomer() {
    let url = `${getAbsolutePath()}Invoice/GetCustomer`;
    let getData = [];
    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            getData.push(await response.json())
            if (getData.length != 0) {
                fillHtmlSelect(getData);
            } else {

            }
        } else if (response.status === 404) {

        } else if (response.status === 500) {
            alertCustomer("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }

    } catch (err) {
        console.log(err);
    }
}

async function fillHtmlSelect(data) {

    document.getElementById("slCliente").innerHTML = "";

    let opt = '<option value="0">Seleccione un cliente</option>';

    data[0].map((x) => {
        opt += `<option value="${x.id}">${x.custName}</option>`;
    });

    document.getElementById("slCliente").innerHTML = opt;
}

async function postSaveInvoice() {

    let tabla = document.getElementById("tablaDetalleFactura");

    if (document.getElementById("slCliente").value === "0") {
        alertCustomer("warning", "Por favor seleccione un cliente.");
        return;
    }
    if (tabla.rows.length < 2) {
        alertCustomer("warning", "Por favor digital una cantidad y un precio.");
        return;
    }

    let detailValues = [];

    for (let i = 1; i < tabla.rows.length; i++) {
        let row = tabla.rows[i];
        let cells = row.cells;

       detailValues.push({ Qty: cells[1].textContent, Price: cells[2].textContent });
    }

    const invoice = {
        Id: 0,
        CustomerId: document.getElementById("slCliente").value,
        TotalItbis: document.getElementById("txtItebis").value,
        SubTotal: document.getElementById("txtSubTotal").value,
        Total: document.getElementById("txtTotal").value,
        InvoiceDetail: detailValues
    };


    let url = `${getAbsolutePath()}Invoice/postSaveInvoice`;
    
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(invoice),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (response.status === 200) {

            $('#exampleModal').modal('show');

            let select = document.getElementById('slCliente');
            document.getElementById("nombreCliente").innerHTML = select.options[select.selectedIndex].text;
            document.getElementById("lbItebis").innerHTML = invoice.TotalItbis;
            document.getElementById("lbSubTotal").innerHTML = invoice.SubTotal;
            document.getElementById("lbTotal").innerHTML = invoice.Total;

            document.getElementById("facturatbodyHtmlTable").innerHTML = "";

            let tr = '';

            detailValues.map((x, i) => {
                i++;
                tr += ` <tr>
                    <th scope="row">${i}</th>
                    <td>${x.Qty}</td>
                    <td>${x.Price}</td>
                </tr>`;
            });

            document.getElementById("facturatbodyHtmlTable").innerHTML = tr;

            document.getElementById("slCliente").value = '0';
            document.getElementById("txtItebis").value = '';
            document.getElementById("txtSubTotal").value = '';
            document.getElementById("txtTotal").value = '';

            while (tabla.rows.length > 0) {
                tabla.deleteRow(1);
            }
           /* await alertCustomer("success", "Factura generada con éxito.");*/

        } else if (response.status === 500) {
            alertCustomer("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }
    } catch (err) {
        console.log(err);
    }

}

async function alertCustomer(icons, message) {
    await Swal.fire({
        icon: icons,
        title: message
    });
}