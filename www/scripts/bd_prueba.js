function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS productos (producto_id, descripcion)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS organismos (organismo_id, imagen1, producto_id)');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Productos", 200000);
    db.transaction(execute, error, exito);

}

function guardarListaProductos() {   
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
    db.transaction(EliminarListaProductos, errorOperacion, operacionEfectuada);
    db.transaction(GuardarProducto, errorOperacion, operacionEfectuada);

}

function EliminarListaProductos(tx) {
    tx.executeSql('DELETE FROM productos');
}

function GuardarProducto(tx) {
    
    $("input:checkbox[name=producto]:checked").each(function () {

        var temp = $(this).val();
        producto_id = temp.substring(0, temp.lastIndexOf('_'));
        descripcion = temp.substring(temp.lastIndexOf('_') + 1);

        tx.executeSql('INSERT INTO productos (producto_id, descripcion) VALUES ("' + producto_id + '", "' + descripcion + '")');
    });

}

// Transaction error callback
function errorOperacion(err) {
    console.log(err);
    alert("Error procesando la operacion: " + err);
}

function operacionEfectuada() {
    console.log("Operacion efectuada!");
}