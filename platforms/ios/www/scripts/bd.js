var producto_id = 0;
var descripcion = "";

var organismos = new Array();

function configurar_db() {

    function execute(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS productos (producto_id, descripcion)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS versiones (version_id, numero)');
    }

    function IngresarVersion(tx) {
        tx.executeSql('INSERT INTO versiones (version_id, numero) VALUES (1, 0)');
    }

    function error(error) {
        console.log("Error al configurar base de datos", error)
    }

    function exito() {
        console.log("Configuración exitosa")
    }

    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Productos", 200000);
    db.transaction(execute, error, exito);
    db.transaction(IngresarVersion, error, exito);

}

function guardarListaProductos() {

    var networkState = navigator.connection.type;

    if(networkState === "wifi" || networkState === "2g" || networkState === "3g" || networkState === "4g") {

        $("#loader").text("Descargando...");
        $("#status").fadeIn();
        $("#preloader").fadeIn();

        var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
        db.transaction(EliminarListaProductos, ErrorOperacion, OperacionEfectuada);
        db.transaction(GuardarProducto, ErrorOperacion, OperacionEfectuada);

        setTimeout(function() {
            
            Crear_ListaOrganismos(organismos);
            organismos = new Array();
            
        }, 2000);

    }
    else {
        alert("Debe tener conexión a internet");
    }
}

function GuardarProducto(tx) {
    
    $("input:checkbox[name=producto]:checked").each(function () {

        var temp = $(this).val();
        producto_id = temp.substring(0, temp.lastIndexOf('_'));
        descripcion = temp.substring(temp.lastIndexOf('_') + 1);
        
        tx.executeSql('INSERT INTO productos (producto_id, descripcion) VALUES ("' + producto_id + '", "' + descripcion + '")');
        
        Buscar_Organismos(producto_id);
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
        //organismos = new Array(); 
    });
}

function Crear_ListaOrganismos(organismos) 
{
    //alert(organismos);
    var ruta = window.localStorage.getItem("ruta");
    var path = ruta + "TATB_Organismos2.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] == data[i].Organismo_Id) {
                    descargar(data[i].Organismo_Foto);
                    descargarImagesSubseccion(data[i].Organismo_Id)
                    //organismo_id = data[i].Organismo_Id;
                    //imagen1 = data[i].Organismo_Foto;                
                    //guardarListaOrganismos();
                    //DescargarImagenesOrganismos();
                }
            }
        });
        $("#status").fadeOut();
        $("#preloader").fadeOut();
        alert("Descarga de contenido exitosa!!");    
    });
}

function descargar(remoteFile) {
    
    //alert(remoteFile);
    var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
    //alert(localFileName);
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

        fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
            //var localPath = fileEntry.fullPath;
            var localPath = fileEntry.fullPath;
            if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                localPath = localPath.substring(7);
            }
            var ft = new FileTransfer();
            ft.download(encodeURI(remoteFile),
            fileSystem.root.toURL() + localPath, function(entry) {

            }, fail);
        }, fail);

    }, fail);
}

function descargarImagesSubseccion(id_organismo){

    var ruta = window.localStorage.getItem("ruta");
    //var ruta2 = "https://dl.dropboxusercontent.com/u/75467020/";
    var path = ruta + "TATB_Fotos2.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            var imagen=field.Foto_Url;
            var nombreImg=imagen.substring(imagen.lastIndexOf('/') + 1)
            var arreglo=nombreImg.split("_");
            var idBicho=arreglo[0];
            if(idBicho==id_organismo){
                //alert(imagen);
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(nombreImg, {create: true, exclusive: false}, function(fileEntry) {
                        var localPath = fileEntry.fullPath;
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(imagen),
                        fileSystem.root.toURL() + localPath, function(entry) {
                        }, fail);
                    }, fail);

                }, fail);
            }
        })
    });
}

//Elimina los registros de la tabla productos
function EliminarListaProductos(tx) {
    tx.executeSql('DELETE FROM productos');
}

//Elimina los registros de la tabla organismos 
function EliminarListaOrganismos(tx) {    
    tx.executeSql('DELETE FROM organismos');
}

//Elimina las imagenes de los organismos 
function  eliminar_imagenes_organismos(tx, results) {
    var len = results.rows.length;
    
    for (var i = 0; i < len; i++) {

        var remoteFile = results.rows.item(i).imagen1;
        //alert(remoteFile);
        var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/')+1);
        
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
            fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                fileEntry.remove(success, fail);
            }, fail);
        }, fail);
    }
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

/*function guardarListaOrganismos() {
    alert(imagen1);
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Organismo", 100000);
    db.transaction(GuardarOrganismo, errorOperacionGuardandoProducto, efectuadaOperacion);
}

function GuardarOrganismo(tx) {
    //alert(imagen1);
    tx.executeSql('INSERT INTO organismos (organismo_id, imagen1, producto_id) VALUES ("' + organismo_id + '", "' + imagen1 + '", "' + producto_id + '")');   
}

//Descarga de imagenes de organismos seleccionados
function DescargarImagenesOrganismos() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Listado Organismos", 200000);
    db.transaction(descargar_lista_imagenes, errorOperacionGuardandoProducto, function () {
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
        alert(remoteFile);
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
}*/