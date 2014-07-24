function cargar_Productos() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Productos", 200000);
    db.transaction(cargar_lista_productos, errorCargar_productos, function () {
        console.log("Consultó los productos")
    });
}

function cargar_lista_productos(tx) {
    tx.executeSql("SELECT * FROM productos", [], crear_lista_productos, function (error) {
        console.log("Error consultado productos: " + error)
    });
}

function crear_lista_productos(tx, results) {
    var texto = "";
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        texto += '<h1 style="margin-left:50px"><input type="checkbox" name="producto" value="'+ results.rows.item(i).producto_id + '">'+ results.rows.item(i).descripcion +'<br>';
    }
    $("#producto").html(texto);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function eliminarProductos() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
    db.transaction(EliminarCultivos, ErrorOperacion, OperacionEfectuada);
}

function EliminarCultivos(tx) {

    $("input:checkbox[name=producto]:checked").each(function () {
        var id = $(this).val();
        tx.executeSql('DELETE FROM productos WHERE producto_id = "' + id + '"');
    });

    document.location.href="elimCultivo.html";
}

// Transaction error callback
function ErrorOperacion(err) {
    console.log(err);
    alert("Error procesando la operación: " + err);
}

function OperacionEfectuada() {
    console.log("Operación efectuada!");
}