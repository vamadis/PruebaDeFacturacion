document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem('Id', '0');
    fetchCustomerType();
});

async function fetchCustomerType() {
    let url = `${getAbsolutePath()}Customer/GetCustomerType`;
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
                fillHtmlTable(getData)

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

async function save() {
    let id = localStorage.getItem('Id');
    if (id != '0') {
        await fetchEditarCustomer();
    } else {
        await fetchCustomerSave();
    }
}

async function fetchCustomerSave() {

    if (document.getElementById("txtNombreCliente").value === "") {
        alertCustomer("warning", "Por favor digite un nombre.");
        return;
    }
    if (document.getElementById("txtDireccion").value === "") {
        alertCustomer("warning", "Por favor digite una dirección.");
        return;
    }
    if (document.getElementById("slTipoCliente").value === "Seleccione un tipo de cliente") {
        alertCustomer("warning", "Por favor seleccione un tipo de cliente.");
        return;
    }


    let url = `${getAbsolutePath()}Customer/PostCustomer`;
    let setData = {
        CustName: document.getElementById("txtNombreCliente").value,
        Adress: document.getElementById("txtDireccion").value,
        Status: document.getElementById("CheckEstado").checked == true ? 'true':'false',
        CustomerTypeId: document.getElementById("slTipoCliente").value
    };
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(setData),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        if (response.status === 200) {
            document.getElementById("txtNombreCliente").value = '';
            document.getElementById("txtDireccion").value = '';
            document.getElementById("CheckEstado").checked = false;
            document.getElementById("slTipoCliente").selected = true;
            await fetchCustomerType();
            await alertCustomer("success", "Registro guardado con éxito.");
        } else if (response.status === 500) {
            alertCustomer("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }
    } catch (err) {
        console.log(err);
    }
}

async function editCustomer(id, custName, adress, status, description) {
    localStorage.setItem("Id", id);
    document.getElementById("txtNombreCliente").value = custName;
    document.getElementById("txtDireccion").value = adress;
    document.getElementById("CheckEstado").checked = status == 'true' ? true : false;
    const selectElement = document.getElementById("slTipoCliente");
    const textoOpcionSeleccionada = description;
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].text === textoOpcionSeleccionada) {
            selectElement.options[i].selected = true;
        } else {
            selectElement.options[i].selected = false;
        }
    }
}

async function fetchEditarCustomer() {

    let url = `${getAbsolutePath()}Customer/PutCustomer`;
    let setData = {
        Id: localStorage.getItem('Id'),
        CustName: document.getElementById("txtNombreCliente").value,
        Adress: document.getElementById("txtDireccion").value,
        Status: document.getElementById("CheckEstado").checked == true ? 'true' : 'false',
        CustomerTypeId: document.getElementById("slTipoCliente").value
    };
    try {

        let response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(setData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            await alertCustomer("success", "Registro actualizado con éxito.");
            localStorage.setItem('Id', '0');
            document.getElementById("txtNombreCliente").value = '';
            document.getElementById("txtDireccion").value = '';
            document.getElementById("CheckEstado").checked = false;
            document.getElementById("slTipoCliente").selected = true;
            await fetchCustomerType();
        } else if (response.status === 500) {
            alertCustomer("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        } else {

        }

    } catch (err) {
        console.log(err);
    }
}

async function fetchEliminateCustomer(id) {
    let url = `${getAbsolutePath()}Customer/EliminateCustomer`;
    let getDatas = [];
    let setData = { Id: id };

    let swfile = await Swal.fire({
        title: '¿Está seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, bórralo!'
    });

    if (swfile.isConfirmed) {
        let response = await fetch(url, {
            method: 'Delete',
            body: JSON.stringify(setData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            await alertCustomer("success", "el registro se borro con éxito");
            await fetchCustomerType();
        } else if (response.status === 500) {
            alertCustomer("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }
    }
}

async function fillHtmlTable(data) {

    document.getElementById("tbodyHtmlTable").innerHTML = "";

    let tr = '';

    data[0].customers.map((x) => {
        tr += ` <tr>
                    <th scope="row">${x.id}</th>
                    <td>${x.custName}</td>
                    <td>${x.adress}</td>
                    <td>${x.description}</td>
                    <td>${x.status == true ? `Activo`:`Desabilitado`}</td>
                    <td>
                        <button type="button" id="btnEditar" class="btn btn-warning" onclick="editCustomer('${x.id}','${x.custName}','${x.adress}','${x.status}','${x.description}')" >Editar</button> |
                        <button type="button" class="btn btn-danger" onclick="fetchEliminateCustomer('${x.id}')" >Eliminar</button>
                    </td>
                </tr>`;
    });

    document.getElementById("tbodyHtmlTable").innerHTML = tr;
}

async function fillHtmlSelect(data) {

    document.getElementById("slTipoCliente").innerHTML = "";

    let opt = '<option selected>Seleccione un tipo de cliente</option>';

    data[0].customerTypes.map((x) => {
        opt += `<option value="${x.id}">${x.description}</option>`;
    });

    document.getElementById("slTipoCliente").innerHTML = opt;
}

async function alertCustomer(icons, message) {
    await Swal.fire({
        icon: icons,
        title: message
    });
}