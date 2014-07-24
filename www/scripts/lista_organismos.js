var organismos = new Array();

var organismo_id = 0;
var imagen1 = "";

function cargar_productos_sel() {
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
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        Buscar_Organismos(results.rows.item(i).producto_id);
    }

    setTimeout(function() {
        Crear_ListaOrganismos(organismos);
        organismos = new Array();
    }, 3000);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function Buscar_Organismos(Prod_Id) 
{
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_OrganismosProdEtapla.json";

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
    alert(organismos);
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_Organismos.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] == data[i].Organismo_Id) { 
                    organismo_id = data[i].Organismo_Id;
                    imagen1 = data[i].Organismo_Foto;
                    //alert(imagen1);        
                    guardarListaOrganismos();
                }
            }
        });    
    });
}

function guardarListaOrganismos() {
    alert(imagen1);
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Organismo", 100000);
    db.transaction(GuardarOrganismo(), errorOperacion, operacionEfectuada);
}

function GuardarOrganismo(tx) {
    tx.executeSql('INSERT INTO organismos (organismo_id, imagen1, producto_id) VALUES ("' + organismo_id + '", "' + imagen1 + '", "' + producto_id + '")');
}

//Descarga de imagenes de organismos seleccionados
function DescargarImagenesOrganismos() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Organismos", 200000);
    db.transaction(descargar_lista_imagenes, errorOperacion, function () {
        console.log("Consultó los organismos")
    });
}

function descargar_lista_imagenes(tx) {
    tx.executeSql("SELECT * FROM organismos", [], descargar_imagenes_organismos, function (error) {
        console.log("Error consultado organismos: " + error)
    });
}

function descargar_imagenes_organismos(tx, results) {
    var len = results.rows.length;
    
    for (var i = 0; i < len; i++) {

        var remoteFile = results.rows.item(i).imagen1;
        //alert(remoteFile);
        var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                var localPath = fileEntry.fullPath;
                if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                    localPath = localPath.substring(7);
                }
                var ft = new FileTransfer();
                ft.download(remoteFile,
                    localPath, function(entry) {

                    }, fail);
            }, fail);
        }, fail);
    }
}

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

// Transaction error callback
function errorOperacion(err) {
    console.log(err);
    alert("Error procesando la operacion: " + err);
}

function operacionEfectuada() {
    console.log("Operacion efectuada!");
}