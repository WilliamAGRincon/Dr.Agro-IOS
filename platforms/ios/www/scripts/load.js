var organismos = new Array();
var relacionesCiclo=new Array();
var relacionesPlanta=new Array();
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

    cargar_Productos();
    //cargar_EtapasCiclo();
    cargar_relaciones_EtapasCiclo();
    cargar_relaciones_partesPlanta() 
    //cargar_PartesPlanta();
}

function fail(evt) {
    console.log(evt.target.error.code);
}

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
        texto += '<h1 style="margin-left:50px"><input type="radio" name="producto" value="'+ results.rows.item(i).producto_id + '" onchange="cambioCheck(this)">'+ results.rows.item(i).descripcion +'<br>';
    }
    $("#producto").html(texto);
}

function errorCargar_productos(err) {
    console.log(err);
    alert("Error consultando listado productos" + err);
}

function cargar_EtapasCiclo(idproducto) 
{
    
    var path = ruta + "TATB_EtapasCicloFenologico2.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        for(var j=0;j<relacionesCiclo.length-1;j++){
        $.each(data, function (i, field) {
                var temp=relacionesCiclo[j].split(",")
                if(temp[1]==data[i].EtapaFen_Id&&temp[0]==idproducto)
                texto += '<h1 style="margin-left:50px"><input type="radio" name="ciclo" value="' + data[i].EtapaFen_Id + '">' + data[i].EtapaFen_Desc + '<br>';
        }); 
        }     
        $("#ciclo").html(texto);
    });
}

function cambioCheck(element){
    if(element.checked){
        var id=element.getAttribute("value")
        cargar_EtapasCiclo(id)
        cargar_PartesPlanta(id);
    }
}

function cargar_relaciones_EtapasCiclo() 
{
    var relacionesTemp=new Array();
    var path = ruta + "TATB_Producto_Etapa_Ciclo.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            relacionesCiclo.push(field.Prod_Id+","+field.Etapa_id);
            //texto += '<h1 style="margin-left:50px"><input type="radio" name="ciclo" value="' + data[i].EtapaFen_Id + '">' + data[i].EtapaFen_Desc + '<br>';
        });      
        //$("#ciclo").html(texto); 
    });
}

function cargar_relaciones_partesPlanta() 
{
    var relacionesTemp=new Array();
    var path = ruta + "TATB_Producto_Parte_Planta.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            relacionesPlanta.push(field.Prod_Id+","+field.PartePlanta_Id);
            //texto += '<h1 style="margin-left:50px"><input type="radio" name="ciclo" value="' + data[i].EtapaFen_Id + '">' + data[i].EtapaFen_Desc + '<br>';
        });      
        //$("#ciclo").html(texto);

    });
}

function cargar_PartesPlanta(id) 
{
    var path = ruta + "TATB_PartesPlanta2.json";
    var texto = "";

    cont = 0;
    numeropp = 1;

    $.getJSON("" + path + "", function(data) {   
        for(var j=0;j<relacionesPlanta.length-1;j++){
        $.each(data, function (i, field) {
            var temp=relacionesPlanta[j].split(",")
            //alert(temp[1]==data[i].PartePlanta_Id&&temp[0]==path+" "+temp[1]+";"+data[i].PartePlanta_Id+":"+temp[0]+" "+id)
                if(temp[1]==data[i].PartePlanta_Id&&temp[0]==id)
            texto += '<h1 style="margin-left:50px"><input type="radio" name="parte" value="' + data[i].PartePlanta_Id + '">' + data[i].PartePlanta_Desc + '<br>';
        });      
    }
        $("#parte").html(texto);
    });
}

function Lista_Organismos() 
{
    var path = ruta + "TATB_OrganismosProdEtapa2.json";
    var texto = "";

    var Prod_Id = 0;
    var EtapaFen_Id = 0;
    var PartePlanta_Id = 0;

    $("input:radio[name=producto]:checked").each(function () {
        Prod_Id = $(this).val();
    });

    $("input:radio[name=ciclo]:checked").each(function () {
        EtapaFen_Id = $(this).val();
    });

    $("input:radio[name=parte]:checked").each(function () {
        PartePlanta_Id = $(this).val();
    });

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if (data[i].Prod_Id == Prod_Id && data[i].EtapaFen_Id == EtapaFen_Id && data[i].PartePlanta_Id == PartePlanta_Id) {
                organismos.push(data[i].Organismo_Id);
            }
        });      
        if (organismos !== null) {
            Cargar_ListaEnfermedades(organismos);
            organismos = new Array();
        }
    });
}

function Cargar_ListaEnfermedades(organismos) 
{
    var path = ruta + "TATB_Organismos2.json";
    var texto = "";

    var lista = $("#listadoEnfermedades");
    lista.empty();

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] === data[i].Organismo_Id) 
                {
                    texto += '<div class="one-half-responsive">' +
                                '<p class="quote-item">' +
                                    '<img src="'+data[i].Organismo_Foto+'" alt="img">' +
                                    '<strong>' + data[i].Organismo_Desc + '</strong><br><br>' +
                                    '<a onclick="Detalle_Organismo('+data[i].Organismo_Id+')" >Leer más</a>' +
                                '</p>' +
                            '</div>';
                }
            };
        });
        texto += '<div class="decoration"></div>' 
        $("#listadoEnfermedades").html(texto);
        Mostrar_Listado();    
    });
}

function Detalle_Organismo(id_organismo)
{
    var conf = confirm("La información contenida en este aplicativo, es una guía que no remplaza el acompañamiento del Asistente Técnico, dado que su aplicación depende de las condiciones específicas de cada área geográfica y por tanto su uso es responsabilidad del usuario consultante");
    if (conf == true) {
        $("#listadoEnfermedades").css("display", "none");
        cargarSecciones(id_organismo);
        $("#detalle").css("display", "block");
    } else {
        
    }
}

function cargarSecciones(id_organismo){
    //var id_organismo=1;
    var nombre_cient="";
    var path = ruta + "TATB_Organismos2.json";
    var img = "";
    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if(field.Organismo_Id==id_organismo){
                $('#img_ppal').attr('src',field.Organismo_Foto)
                var ficha_tecnica='<table cellspacing="0" class="table">';

                if(field.Organismo_Genero.toUpperCase()!='NULL')
                    nombre_cient=field.Organismo_Genero

                if(field.Organismo_Especie.toUpperCase()!='NULL')
                    nombre_cient+=field.Organismo_Especie

                if(field.Organismo_Descriptor.toUpperCase()!='NULL')
                    nombre_cient+=' '+field.Organismo_Descriptor
                if(nombre_cient!="")
                    //ficha_tecnica+='<tr><td class="table-sub-title"> Nombre cientifico:</td><td>'+ field.Organismo_Genero+' '+field.Organismo_Especie+' ' +field.Organismo_Descriptor +'</td></tr>'
                ficha_tecnica+='<tr><td class="table-sub-title"> Nombre cientifico:</td><td>'+ nombre_cient +'</td></tr>'

                if(field.Organismo_Clase.toUpperCase()!='NULL'){
                    ficha_tecnica+='<tr><td class="table-sub-title"> Clase:</td><td>'+ field.Organismo_Clase+'</td></tr>'   
                }

                if(field.Organismo_Orden.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Orden:</td><td>'+field.Organismo_Orden+'</td></tr>'

                if(field.Organismo_Familia.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Familia:</td><td>'+ field.Organismo_Familia+'</td></tr>'

                if(field.Organismo_Genero.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Genéro:</td><td><p style="font-style: italic;">'+field.Organismo_Genero+'</p></td></tr>'

                if(field.Organismo_Especie.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Especie:</td><td> <p style="font-style: italic;">'+field.Organismo_Especie+'</p></td></tr></table>'
                //$("#tbl_Ficha_Tecnica").html(ficha_tecnica);

                if(field.Organismo_Comun.toUpperCase()!='NULL')
                    var nombre_comun='<h4>Nombre Común</h4><p>'+ field.Organismo_Comun+'</p>'
                document.getElementById('div_nombre_ppal').innerHTML='<p>'+ field.Organismo_Comun+'</p>';                
                //$("#div_nombre_Comun").html(nombre_comun);

                if(field.Organismo_Comun.toUpperCase()!='NULL')
                    var nombre_Cientifico='<h4>Nombre Científico</h4><p>'+ nombre_cient +'</p>'
                //$("#div_nombre_Cientifico").html(nombre_Cientifico);
                var Clasificacion_taxonomica='<table cellspacing="0" class="table">';

                if(field.Organismo_Clase.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Clase:</td><td>'+ field.Organismo_Clase +'</td></tr>'

                if(field.Organismo_Orden.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Orden:</td><td>'+field.Organismo_Orden+'</td></tr>'

                if(field.Organismo_Familia.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Familia</td><td>'+ field.Organismo_Familia+'</td></tr>'

                if(field.Organismi_SubFamilia.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Subfamilia</td><td>'+field.Organismi_SubFamilia+'</td></tr>'

                if(field.Organismo_Tribu.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Tribu</td><td>'+ field.Organismo_Tribu+'</td></tr>'

                if(field.Organismo_Genero.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Genéro:</td><td> <p style="font-style: italic;">'+field.Organismo_Genero+'</p></td></tr>'

                if(field.Organismo_Especie.toUpperCase()!='NULL')
                    Clasificacion_taxonomica+='<tr><td class="table-sub-title"> Especie:</td><td> <p style="font-style: italic;">'+field.Organismo_Especie+'</p></td></tr></table>'
                //$("#tbl_Clasificacion_Taxonomica").html(Clasificacion_taxonomica);
                //CargarSubsecciones(field.Organismo_Id)
                document.getElementById('tbl_Clasificacion_Taxonomica').innerHTML=Clasificacion_taxonomica;
                document.getElementById('div_nombre_Cientifico').innerHTML=nombre_Cientifico;
                document.getElementById('div_nombre_Comun').innerHTML=nombre_comun;
                document.getElementById('tbl_Ficha_Tecnica').innerHTML=ficha_tecnica
                cargarSubSecciones(field.Organismo_Id);
            }
        });
});
}

function cargarSubSecciones(id_Organismo){
    //alert("hola")
    var path = ruta + "TATB_OrganismosSubSec2.json";
    var carac_grales="";
    var intro="";
    var geo="";
    var biologia_habitat="";
    var Hospederos="";
    var como_alimenta="";
    var diseminacion="";
    var ciclo_vida="";
    var comportamiento="";
    var distribucion_espacial="";
    var identificacion_prevencion="";
    var param_identificacion="";
    var man_poblaciones=""
    var estrategias_manejo="";
    var medidas_prevencion="";
    var metodos_control="";
    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if(field.Organismo_Id==id_Organismo){

                switch(field.SubSecAgro_Id){
                    case 21:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            intro='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_21.jpg" alt="" OnError="Error_Cargar()">';
                        }
                        //$("#intro").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 22:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            geo='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_22.jpg" alt="" OnError="Error_Cargar()">';
                        }
                        //$("#geo").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 31:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
            
                            Hospederos='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_31.jpg" alt="" OnError="Error_Cargar()">';

                        }
                        //$("#div_Hospederos").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 32:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            como_alimenta='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_32.jpg" alt="" OnError="Error_Cargar()">'     
                        }
                        //$("#div_como_Alimenta").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;  
                    }
                    case 33:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            diseminacion='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_33.jpg" alt="" OnError="Error_Cargar()">'  
                        }
                        //$("#div_diseminacion").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;  
                    }
                    case 34:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            ciclo_vida='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_34.jpg" alt="" OnError="Error_Cargar()">'
                        }
                        //$("#ciclo_vida").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 35:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            comportamiento='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_35.jpg" alt="" OnError="Error_Cargar()">'
                        }
                        //$("#div_comportamiento").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;      
                    }
                    case 36:{
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            distribucion_espacial='<p>'+field.OrgSub_Desc+'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_36.jpg" alt="" OnError="Error_Cargar()">'
                        }
                        //$("#div_comportamiento").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;      
                    }
                    case 10: {
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            identificacion_prevencion=field.OrgSub_Desc+'<br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_10.jpg" alt="" OnError="Error_Cargar()">';
                        }
                        //$("#identificacion").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 41:
                    {
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            medidas_prevencion='<div class="container no-bottom"><h4>Medidas de Prevención</h4></div><div class="container no-bottom">'+
                        '<p>'+field.OrgSub_Desc +'</p><br /><img class="responsive-image" src="'+id_Organismo+'_Organismo_41.jpg" alt="" OnError="Error_Cargar()"></div>'
                        }
                    }
                    case 42:
                    {
                        if(field.SubSecAgro_Desc.toUpperCase()!='NULL'){
                            metodos_control='<div class="container no-bottom"><h4>Métodos de control</h4></div><div class="container no-bottom">'+
                        '<p>'+field.OrgSub_Desc +'</p><br /><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_42.jpg" alt="" OnError="Error_Cargar()"></div>'
                        }
                    }
                    case 50:
                    {

                    }
                    case 60:
                    {

                    }
                }



            }
        });
            if(intro!="" && geo!=""){
                //document.getElementById('tab1').innerHTML=intro;
                //document.getElementById('tab2').innerHTML=geo;
                                carac_grales='<div class="container no-bottom"><h4>Características Generales</h4></div>'+
                                '<div class="container"><div class="tabs"><a href="#" class="tab-but tab-but-1 tab-active">Introduccíon</a>'+
                                '<a href="tab2" class="tab-but tab-but-2" >Dist. Geográfica</a> </div><div class="tab-content tab-content-1">'+intro+'</div><div class="tab-content tab-content-2" id="tab2">'+geo+'</div></div>';
                                document.getElementById('div_caracteristicas_grales').innerHTML=carac_grales;
                }else if(intro!=""){
                    carac_grales='<div class="container no-bottom"><h4>Características Generales</h4></div>'+
                    '<div class="container"><div class="tabs"><a href="#" class="tab-but tab-but-1 tab-active">Introduccíon</a>'+
                    '</div><div class="tab-content tab-content-1">'+intro+'</div></div>'
                    //document.getElementById('secund_tab').style.visibility = "visible";
                    //document.getElementById('ppal_tab').style.visibility = "hidden";
                    //document.getElementById('title-tab').innerHTML='<p>'+Introdución+'</p>';
                    //document.getElementById('tab_secund_1').innerHTML=intro;
                }else if(geo!=""){
                    carac_grales='<div class="container no-bottom"><h4>Características Generales</h4></div>'+
                    '<div class="container"><div class="tabs"><a href="#" class="tab-but tab-but-1 tab-active" >Dist. Geográfica</a>'+
                    '</div><div class="tab-content tab-content-1">'+geo+'</div></div>'
                    document.getElementById('div_caracteristicas_grales').innerHTML=carac_grales;
                    //document.getElementById('secund_tab').style.visibility = "visible";
                    //document.getElementById('ppal_tab').style.visibility = "hidden";
                    //document.getElementById('title-tab').innerHTML='<p>'+Dist. Geográfica+'</p>';
                    //document.getElementById('tab_secund_1').innerHTML=geo;
                }else{
                    document.getElementById('div_caracteristicas_grales').innerHTML="";
                }
                if(Hospederos!=""||como_alimenta!=""||diseminacion!=""||ciclo_vida!=""||comportamiento!=""||distribucion_espacial!=""){
                    //biologia_habitat='<div class="container no-bottom"><h4>Biología y Habitat</h4></div>'
                    
                    if(Hospederos!=""){
                        document.getElementById('Hospederos_H').innerHTML=Hospederos;
                    }else{
                        document.getElementById('Hospederos_P').innerHTML="";
                    }
                    if(como_alimenta!=""){
                        document.getElementById('como_alimenta_H').innerHTML=como_alimenta;
                    }else{
                        document.getElementById('como_alimenta_P').innerHTML="";
                    }
                    if(diseminacion!=""){
                        document.getElementById('diseminacion_H').innerHTML=diseminacion;
                    }else{
                        document.getElementById('diseminacion_P').innerHTML="";
                    }
                    if(ciclo_vida!=""){
                        document.getElementById('ciclo_vida_H').innerHTML=ciclo_vida;
                    }else{
                        document.getElementById('ciclo_vida_P').innerHTML="";
                    }
                    if(comportamiento!=""){
                        document.getElementById('comportamiento_H').innerHTML=comportamiento;
                    }else{
                        document.getElementById('comportamiento_P').innerHTML=comportamiento;
                    }
                    if(distribucion_espacial!=""){
                        document.getElementById('distribucion_espacial_H').innerHTML=distribucion_espacial;
                    }else{
                        document.getElementById('distribucion_espacial_P').innerHTML="";
                    }       
                }else{
                    document.getElementById('Biologia_Habitat_ppal').innerHTML="";
                }
                if(metodos_control!=""){
                    document.getElementById('div_control').innerHTML=metodos_control;   
                }else{
                    document.getElementById('div_control').innerHTML="";    
                }
                if(medidas_prevencion!=""){
                        document.getElementById('div_prevencion').innerHTML=medidas_prevencion; 
                }else{
                    document.getElementById('div_prevencion').innerHTML=""; 
                }
            });
}

function Error_Cargar() {
window.event.srcElement.style.display = "None";
}

function Mostrar_Listado()
{
    $("#detalle").css("display", "none");
    $("#listadoEnfermedades").css("display", "block");
}