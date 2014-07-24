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
        //alert(results.rows.item(i).producto_id);
        Buscar_Organismos(results.rows.item(i).producto_id);
    }

    setTimeout(function() {
        
        Crear_ListaOrganismos(organismos);
        
        setTimeout(function() {
            Crear_ListaOrganismos(organismos);
        }, 3000);

    }, 3000);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function Buscar_Organismos(Prod_Id) 
{
    organismos = new Array();
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
    var path = ruta + "TATB_Organismos2.json";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] === data[i].Organismo_Id) {
                    organismo_id = data[i].Organismo_Id;
                    imagen1 = data[i].Organismo_Foto;                   
                    guardarListaOrganismos();
                }
            }
        });    
    });
}

function guardarListaOrganismos() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Organismo", 100000);
    db.transaction(GuardarOrganismo, errorOperacion, operacionEfectuada);
}

function GuardarOrganismo(tx) {
    tx.executeSql('INSERT INTO organismos (organismo_id, imagen1, producto_id) VALUES ("' + organismo_id + '", "' + imagen1 + '", "' + producto_id + '")');   
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