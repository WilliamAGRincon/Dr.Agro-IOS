var organismos = new Array();
var foto = "";
var nombre = "";

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
        texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="checkbox" name="producto" value="'+ results.rows.item(i).producto_id + '"/>'+ results.rows.item(i).descripcion +'</h3>';
    }
    $("#producto").html(texto);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function eliminarProductos() {
    
    $("#loader").text("Eliminando...");
    $("#status").fadeIn();
    $("#preloader").fadeIn();

    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
    db.transaction(EliminarCultivos, ErrorOperacion, OperacionEfectuada);

    setTimeout(function() {
        
        Crear_ListaOrganismos(organismos);
        organismos = new Array();
        
    }, 2000);
}

function EliminarCultivos(tx) {

    $("input:checkbox[name=producto]:checked").each(function () {
        
        var id = $(this).val();
        
        tx.executeSql('DELETE FROM productos WHERE producto_id = "' + id + '"');
        
        Buscar_Organismos(id);
    });
}

//Proceso para guardar los organismos pertenecientes al cultivo
function Buscar_Organismos(Prod_Id) 
{
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_OrganismosProdEtapa2.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if (data[i].Prod_Id == Prod_Id) {
                organismos.push(data[i].Organismo_Id);
            }
        });
        organismos = eliminateDuplicates(organismos);
    });
}

function Crear_ListaOrganismos(organismos) 
{
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_Organismos2.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] == data[i].Organismo_Id) {
                    foto = data[i].Organismo_Foto;
                    nombre = foto.substring(foto.lastIndexOf('/')+1);
                    eliminar(nombre);
                    eliminarImagesSubseccion(data[i].Organismo_Id)
                }
            }
        });
        $("#status").fadeOut();
        $("#preloader").fadeOut();
        alert("Eliminación de contenido exitosa!!");

        /*setTimeout(function() {
            document.location.href="elimCultivo.html";
        }, 1000);*/ 
    });
}

function eliminar(localFileName) {
        
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

        fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
            fileEntry.remove(success, fail);
        }, fail);

    }, fail);
}

function eliminarImagesSubseccion(id_organismo)
{
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_Fotos2.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            var imagen=field.Foto_Url;
            var nombreImg=imagen.substring(imagen.lastIndexOf('/') + 1);
            var arreglo=nombreImg.split("_");
            var idBicho=arreglo[0];
            if(idBicho==id_organismo){
                
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(nombreImg, {create: true, exclusive: false}, function(fileEntry) {
                        fileEntry.remove(success, fail);
                    }, fail);

                }, fail);

            }
        })
    });
}

//Funcion que permite elmiminar los id de organismos repetidos
function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};
 
  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

//Funcion exito
function success(entry) {
    console.log("Removal succeeded");
}

//Funcion Fallo
function fail(error) {
    console.log(error.code);
}

// Transaction error callback
function ErrorOperacion(err) {
    console.log(err);
    alert("Error procesando la operación: " + err);
}

function OperacionEfectuada() {
    console.log("Operación efectuada!");
}
