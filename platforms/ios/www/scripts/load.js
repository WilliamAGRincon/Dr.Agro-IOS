var organismos = new Array();
var relacionesCiclo=new Array();
var relacionesPlanta=new Array();
var ruta = "";
var id_Producto;
var id_EtapaCiclo;
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
        texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="radio" name="producto" value="'+ results.rows.item(i).producto_id + '" onchange="cambioCheck(this)" />'+ results.rows.item(i).descripcion +'</h3>';
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
                texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="radio" onchange="cambioCheckEtapa(this)" name="ciclo" value="' + data[i].EtapaFen_Id + '" />' + data[i].EtapaFen_Desc + '</h3>';
        }); 
        }     
        $("#ciclo").html(texto);
    });
}

function cambioCheck(element){
    if(element.checked){
        var id=element.getAttribute("value")
        cargar_EtapasCiclo(id)
        id_Producto=id;
        //cargar_PartesPlanta(id);
    }
}

function cambioCheckEtapa(element){
    if(element.checked){
        var id=element.getAttribute("value")
        //cargar_EtapasCiclo(id)
        id_EtapaCiclo=id;
        cargar_PartesPlanta(id);
    }
}

function cargar_relaciones_EtapasCiclo() 
{
    var relacionesTemp=new Array();
    var path = ruta + "TATB_ProductosEtapa.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            relacionesCiclo.push(field.Prod_Id+","+field.EtapaFen_Id);
            //texto += '<h1 style="margin-left:50px"><input type="radio" name="ciclo" value="' + data[i].EtapaFen_Id + '">' + data[i].EtapaFen_Desc + '<br>';
        });      
        //$("#ciclo").html(texto); 
    });
}

function cargar_relaciones_partesPlanta() 
{
    var relacionesTemp=new Array();
    var path = ruta + "TATB_ProductosEtapaPlanta.json";
    var texto = "";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            relacionesPlanta.push(field.Prod_Id+","+field.PartePlanta_Id+","+field.EtapaFen_Id);
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
                if(temp[1]==data[i].PartePlanta_Id&&temp[0]==id_Producto&&temp[2]==id_EtapaCiclo)
            texto += '<h3 style="margin-left:20px;font-family:Verdana;"><input type="radio" name="parte"  value="' + data[i].PartePlanta_Id + '" />' + data[i].PartePlanta_Desc + '</h3>';
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
        texto += '<h1 style="font-weight:bold;font-style:Verdana">Listado Organismos</h1>'; 
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] === data[i].Organismo_Id) 
                {
                    texto += '<div class="decoration"></div>'+'<div style="padding-bottom:25px !important;">' +
                                '<h3 style="font-weight:bold;font-style:Verdana;text-align:center">' + data[i].Organismo_Desc + '</h3>' +
                                '<a onclick="Detalle_Organismo('+data[i].Organismo_Id+')"><div>' +
                                    '<img src="'+ruta+data[i].Organismo_Id+"_Organismo_0.jpg"+'" alt="img" style="border-radius:55%;width:150px;margin-left:auto;margin-right:auto">' +
                                    '<h4 style="font-weight:bold;font-style:Verdana;text-align:center">Leer más</h4>' +
                                '</div></a>' + '<div class="decoration"></div>' +
                            '</div>';
                }
            };
        });        
        $("#listadoEnfermedades").html(texto);
        Mostrar_Listado();    
    });
}

/*function Cargar_ListaEnfermedades(organismos) 
{
    var path = ruta + "TATB_Organismos2.json";
    var texto = "";

    var lista = $("#listadoEnfermedades");
    lista.empty();

    $.getJSON("" + path + "", function(data) {  
        texto += '<h2>Listado Organismos</h2>'; 
        $.each(data, function (i, field) {
            for (var j = 0; j < organismos.length; j++) {
                if (organismos[j] === data[i].Organismo_Id) 
                {
                    alert(data[i].Organismo_Foto);
                    texto += '<div class="one-half-responsive" style="padding-bottom:25px !important;">' +
                                '<a onclick="Detalle_Organismo('+data[i].Organismo_Id+')"><p class="quote-item">' +
                                    '<img src="'+data[i].Organismo_Foto+'" alt="img">' +
                                    '<strong>' + data[i].Organismo_Desc + '</strong><br><br>' +
                                    'Leer más' +
                                '</p></a>' +
                            '</div>';
                }
            };
        });
        texto += '<div class="decoration"></div>' 
        $("#listadoEnfermedades").html(texto);
        Mostrar_Listado();    
    });
}*/

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
                //$('#a_ppal').attr('href',field.Organismo_Foto)
                $('#img_ppal').attr('src',ruta+field.Organismo_Id+"_Organismo_0.jpg")
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

                 if(field.Organismi_SubFamilia.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Subfamilia:</td><td>'+ field.Organismi_SubFamilia+'</td></tr>'
 
                if(field.Organismo_Tribu.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Tribu:</td><td>'+ field.Organismo_Tribu+'</td></tr>'

                if(field.Organismo_Genero.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Genéro:</td><td><p style="font-style: italic;">'+field.Organismo_Genero+'</p></td></tr>'

                if(field.Organismo_Especie.toUpperCase()!='NULL')
                    ficha_tecnica+='<tr><td class="table-sub-title"> Especie:</td><td> <p style="font-style: italic;">'+field.Organismo_Especie+'</p></td></tr></table>'
                //$("#tbl_Ficha_Tecnica").html(ficha_tecnica);

                if(field.Organismo_Comun.toUpperCase()!='NULL')
                    var nombre_comun='<h2>Nombre Común</h2><p>'+ field.Organismo_Comun+'</p>'
                document.getElementById('div_nombre_ppal').innerHTML='<p>'+ field.Organismo_Comun+'</p>';                
                //$("#div_nombre_Comun").html(nombre_comun);

                if(field.Organismo_Comun.toUpperCase()!='NULL')
                    var nombre_Cientifico='<h2>Nombre Científico</h2><p>'+ nombre_cient +'</p>'
                //$("#div_nombre_Cientifico").html(nombre_Cientifico);
                
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
    var referencias_bibliograficas="";
    var listado_registros="";

    $.getJSON("" + path + "", function(data) {   
        $.each(data, function (i, field) {
            if(field.Organismo_Id==id_Organismo){

                switch(field.SubSecAgro_Id){
                    case 21:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            intro='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_21.jpg" alt="" OnError="Error_Cargar()"></div>'
                        }
                        //$("#intro").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 22:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            geo='<p>'+field.OrgSub_Desc+'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_22.jpg" alt="" OnError="Error_Cargar()"></div>';
                        }
                        //$("#geo").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 31:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){

                            Hospederos='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_31.jpg" alt="" OnError="Error_Cargar()"></div>';
                            
                            $('#img_hospederos').attr('src',ruta+id_Organismo+"_Organismo_31.jpg")
                            $('#img_hospederos').attr('OnError','Error_Cargar()')
                        }
                        //$("#div_Hospederos").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 32:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            como_alimenta='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_32.jpg" alt="" OnError="Error_Cargar()"></div>'     
                            
                            $('#img_dano').attr('src',ruta+id_Organismo+"_Organismo_32.jpg")
                            $('#img_dano').attr('OnError','Error_Cargar()')
                        }
                        //$("#div_como_Alimenta").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;  
                    }
                    case 33:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            diseminacion='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_33.jpg" alt="" OnError="Error_Cargar()"></div>'  
                            
                            $('#img_diseminacion').attr('src',ruta+id_Organismo+"_Organismo_33.jpg")
                            $('#img_diseminacion').attr('OnError','Error_Cargar()')
                        }
                        //$("#div_diseminacion").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;  
                    }
                    case 34:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            //ciclo_vida='<p>'+field.OrgSub_Desc+'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_34.jpg" alt="" OnError="Error_Cargar()"></div>'
                            //ciclo_vida='<p>'+field.OrgSub_Desc+'</p><br />';//'<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_34.jpg" alt="" OnError="Error_Cargar()"></div>'
                                ciclo_vida='<p>'+field.OrgSub_Desc+'</p><br />'
                                
                                $('#img_ciclo').attr('src',ruta+id_Organismo+"_Organismo_34.jpg")
                                $('#img_ciclo').attr('OnError','Error_Cargar()')
                            }

                            break;
                        }
                        case 35:{
                            if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                                comportamiento='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_35.jpg" alt="" OnError="Error_Cargar()"></div>'
                                
                                $('#img_comportamiento').attr('src',ruta+id_Organismo+"_Organismo_35.jpg")
                                $('#img_comportamiento').attr('OnError','Error_Cargar()')
                            }
                        //$("#div_comportamiento").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;      
                    }
                    case 36:{
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            distribucion_espacial='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_36.jpg" alt="" OnError="Error_Cargar()"></div>'
                            
                            $('#img_distribucion').attr('src',ruta+id_Organismo+"_Organismo_31.jpg")
                            $('#img_distribucion').attr('OnError','Error_Cargar()')
                        }
                        //$("#div_comportamiento").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;      
                    }
                    case 10: {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                            identificacion_prevencion=field.OrgSub_Desc+'<br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_10.jpg" alt="" OnError="Error_Cargar()"></div>';
                            //$('#link_prevencion').attr('href',ruta+id_Organismo+"_Organismo_10.jpg")
                            //$('#img_prevencion').attr('src',ruta+id_Organismo+"_Organismo_10.jpg")
                        }
                        //$("#identificacion").html('<p>'+field.OrgSub_Desc+'</p>');
                        break;
                    }
                    case 41:
                    {
                        if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                        /*    medidas_prevencion='<div class="container no-bottom"><h2>Medidas de Prevención</h2></div><div class="container no-bottom">'+
                        '<p>'+field.OrgSub_Desc +'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+id_Organismo+'_Organismo_41.jpg" alt="" OnError="Error_Cargar()"></div></div>'*/
                        medidas_prevencion='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_41.jpg" alt="" OnError="Error_Cargar()"></div></div>'
                        
                            $('#img_prevencion').attr('src',ruta+id_Organismo+"_Organismo_41.jpg")
                            $('#img_prevencion').attr('OnError','Error_Cargar()')
                    }
                }
                case 42:
                {
                    if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                       /* metodos_control='<div class="container no-bottom"><h2>Métodos de control</h2></div><div class="container no-bottom">'+
                       '<p>'+field.OrgSub_Desc +'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_42.jpg" alt="" OnError="Error_Cargar()"></div></div>'*/
                       metodos_control='<p>'+field.OrgSub_Desc+'</p><br />'//<div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_42.jpg" alt="" OnError="Error_Cargar()"></div></div>'
                        
                        $('#img_control').attr('src',ruta+id_Organismo+"_Organismo_42.jpg")
                        $('#img_control').attr('OnError','Error_Cargar()')
                   }
               }
               case 50:
               {
                if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                    listado_registros='<p>'+field.OrgSub_Desc +'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_50.jpg" alt="" OnError="Error_Cargar()"></div></div>'
                }
            }
            case 60:
            {
                if(field.OrgSub_Desc.toUpperCase()!='NULL'){
                    referencias_bibliograficas='<p>'+field.OrgSub_Desc +'</p><br /><div class="portfolio-item-full-width pinchzoom" style="overflow:hidden"><img class="responsive-image" src="'+ruta+id_Organismo+'_Organismo_60.jpg" alt="" OnError="Error_Cargar()"></div></div>'
                }
            }
                }



            }
        });
            if(intro!="" && geo!=""){
                document.getElementById('tab1').innerHTML=intro;
                document.getElementById('tab2').innerHTML=geo;
                                // carac_grales='<div class="container no-bottom"><h4>Características Generales</h4></div>'+
                                // '<div class="container"><div class="tabs"><a href="#" class="tab-but tab-but-1 tab-active">Introduccíon</a>'+
                                // '<a href="tab2" class="tab-but tab-but-2" >Dist. Geográfica</a> </div><div class="tab-content tab-content-1">'+intro+'</div><div class="tab-content tab-content-2" id="tab2">'+geo+'</div></div>';
                                // document.getElementById('div_caracteristicas_grales').innerHTML=carac_grales;
                }else if(intro!=""){
                    carac_grales='<div class="container no-bottom"><h2>Características Generales</h2></div>'+
                    '<div class="container"><div class="tabs"><a href="#" class="tab-but tab-but-1 tab-active">Introduccíon</a>'+
                    '</div><div class="tab-content tab-content-1">'+intro+'</div></div>'
                    document.getElementById('div_caracteristicas_grales').innerHTML=carac_grales;
                    //document.getElementById('secund_tab').style.visibility = "visible";
                    //document.getElementById('ppal_tab').style.visibility = "hidden";
                    //document.getElementById('title-tab').innerHTML='<p>'+Introdución+'</p>';
                    //document.getElementById('tab_secund_1').innerHTML=intro;
                }else if(geo!=""){
                    carac_grales='<div class="container no-bottom"><h2>Características Generales</h2></div>'+
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
                if(metodos_control!="" && medidas_prevencion!=""){
                    document.getElementById('Prevencion_H').innerHTML=medidas_prevencion;
                    document.getElementById('control_H').innerHTML=metodos_control;
                }else if(metodos_control!=""){
                    document.getElementById('Prevencion_P').innerHTML="";
                    document.getElementById('control_H').innerHTML=metodos_control;
                }else if(medidas_prevencion!=""){
                    document.getElementById('Prevencion_P').innerHTML=medidas_prevencion;
                    document.getElementById('control_H').innerHTML="";
                }else{
                    document.getElementById('Estrategias_Manejo_ppal').innerHTML="";
                }    

                if(referencias_bibliograficas!=""){
                    document.getElementById('bibliografia_H').innerHTML=referencias_bibliograficas; 
                }else{
                    document.getElementById('bibliografia_P').innerHTML=""; 
                }

                if(listado_registros!=""){
                    document.getElementById('registros_H').innerHTML=listado_registros; 
                }else{
                    document.getElementById('registros_P').innerHTML=""; 
                }            
            });
}

function Error_Cargar() {
window.event.srcElement.style.display = "None";
//element.style.display = "none";
}

function asignarZoom(){
    //var imagenes=$('<img/>');
    var list = document.getElementsByClassName("pinchzoom")
    for(var i=0;i<list.length;i++){
        //alert(list[i].getAttribute("src"))
        crearZoom(list[i])
    }
    //alert(list.length)
    //$("<img/>")
    //.load(function() { alert("image loaded correctly"); })
    //.error(function() { Error_Cargar()})
}


function Mostrar_Listado()
{
    $("#detalle").css("display", "none");
    $("#listadoEnfermedades").css("display", "block");
}

function crearZoom(element){
    if(!Hammer.HAS_TOUCHEVENTS && !Hammer.HAS_POINTEREVENTS) {
        Hammer.plugins.fakeMultitouch();
    }

    //var hammertime = Hammer(document.getElementById('pinchzoom'), {
    var hammertime = Hammer(element, {
        preventDefault      : true,
        transformMinScale   : 1,
        dragBlockHorizontal : true,
        dragBlockVertical   : true,
        dragMinDistance     : 0
    });

    //var rect = document.getElementById('rect');parentElement.firstChild
    var rect=element.firstChild;

    var posX = 0, posY = 0,
    scale = 1, last_scale = 1,
    rotation = 0, last_rotation = 0;

    hammertime.on('touch drag transform', function(ev) {
        switch(ev.type) {
            case 'touch':
            last_scale = scale;
            last_rotation = rotation;
            break;

            case 'drag':
            posX = ev.gesture.deltaX;
            posY = ev.gesture.deltaY;
            break;

            case 'transform':
        rotation = 0;//last_rotation + ev.gesture.rotation;
        scale = Math.max(1, Math.min(last_scale * ev.gesture.scale, 10));
        break;
    }

    // transform!
    var transform =
    "translate3d(" + posX + "px," + posY + "px, 0) " +
    "scale3d(" + scale + "," + scale + ", 1) " +
    "rotate(" + rotation + "deg) ";

    rect.style.transform = transform;
    rect.style.oTransform = transform;
    rect.style.msTransform = transform;
    rect.style.mozTransform = transform;
    rect.style.webkitTransform = transform;
});
}