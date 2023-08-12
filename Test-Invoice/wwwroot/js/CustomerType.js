document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem('Id', '0');
    fetchCustomerType();
});

async function fetchCustomerType() {
    let url = `${getAbsolutePath()}CustomerType/GetCustomerType`;
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

                fillHtmlTable(getData);

            } else {

            }
        } else if (response.status === 404) {
           
        } else if (response.status === 500) {
            alertCustomerType("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }

    } catch (err) {
        console.log(err);
    }
}

async function save() {
    let id = localStorage.getItem('Id');
    if (id != '0') {
      await  fetchEditarCustomerType();
    } else {
      await  fetchCustomerTypeSave();
    }
}



async function fetchCustomerTypeSave() {

    let description = document.getElementById("txtDescripcion").value;

    if (description === "") {
        alertCustomerType("warning", "Por favor digite un tipo de cliente.");
        return;
    }

    let url = `${getAbsolutePath()}CustomerType/PostCustomerType`;
    let setData = {
        Description: description,
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
            fetchCustomerType();
            localStorage.getItem('Id', '0');
            document.getElementById("txtDescripcion").value = '';
        } else if (response.status === 500) {
            alertCustomerType("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }
    } catch (err) {
        console.log(err);
    }
}

async function editCustomerType(id,description) {
    localStorage.setItem("Id", id);
    document.getElementById("txtDescripcion").value = description;
}

async function fetchEditarCustomerType() {

    let url = `${getAbsolutePath()}CustomerType/PutCustomerType`;
    let datas = [];
    let setData = {
        Id: localStorage.getItem('Id'),
        Description: document.getElementById("txtDescripcion").value
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
            localStorage.setItem('Id', '0');
            document.getElementById("txtDescripcion").value = '';
           await fetchCustomerType();

            /*datas.push(await response.json())*/
            //if (datas[0].isSuccess) {
                
            //}
        } else if (response.status === 500) {
            alertCustomerType("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        } else {

        }

    } catch (err) {
        console.log(err);
    }
}

async function fetchEliminateCustomerType(id) {
    let url = `${getAbsolutePath()}CustomerType/EliminateCustomerType`;
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

          await  alertCustomerType("success", "el registro se borro con éxito");

           await fetchCustomerType();
           /* getDatas.push(await response.json())*/
            //if (getDatas[0].isSuccess) {
            //    await fetchApiListadoMiembros();
            //    await alertMiembro('success', getDatas[0].message)
            //} else {
            //    await alertMiembro('info', getDatas[0].message)
            //}

        } else if (response.status === 500) {
            alertCustomerType("error", "Se produjo un error inesperado. Inténtelo de nuevo más tarde.");
        }
    }
}

async function fillHtmlTable(data) {

    document.getElementById("tbodyHtmlTable").innerHTML = "";

    let tr = '';

    data[0].map((x) => {
        tr += ` <tr>
                    <th scope="row">${x.id}</th>
                    <td>${x.description}</td>
                    <td>
                        <button type="button" id="btnEditar" class="btn btn-warning" onclick="editCustomerType('${x.id}','${x.description}')" >Editar</button> |
                        <button type="button" class="btn btn-danger" onclick="fetchEliminateCustomerType('${x.id}')" >Eliminar</button>
                    </td>
                </tr>`;
    });

    document.getElementById("tbodyHtmlTable").innerHTML = tr;
}

async function alertCustomerType(icons, message) {
    await Swal.fire({
        icon: icons,
        title: message
    });
}