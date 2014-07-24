var organismos = new Array();
var ruta = "";

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

function gotFS(fileSystem) {
    fileSystem.root.getFile("TATB_Productos2.json", null, gotFileEntry, fail);
    ruta = fileSystem.root.toURL();
}

function gotFileEntry(fileEntry) {
    fileEntry.file(gotFile, fail);
}

function gotFile(file){

    /*var path = file.fullPath;
    ruta = path.substring(0, path.lastIndexOf('/') + 1);*/

    cargar_Consejos();
}

function fail(evt) {
    console.log(evt.target.error.code);
}

function cargar_Consejos()
{
    var path = ruta + "TATB_TipsDrAgro.json";     
    
    var texto = "";
    consejos = new Array(); 
    cont = 0;
    numeropp = 1;
    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {                       
           consejos[i] = data[i].DrAgroTips_Desc;             
            
                numeropp++;
                cont++;           
            
        }); 
        
        var consejosId = Math.floor((Math.random() * consejos.length) + 0);
        
        texto += '<p style="font-size:18px;margin-right:15px;margin-left:15px;margin-top:15px">' + data[consejosId].DrAgroTips_Desc + '</p>';
        
        $("#consejosDrAgro").html(texto); 
    });
    
}