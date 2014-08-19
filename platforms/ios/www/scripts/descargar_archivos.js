function init(){
    document.addEventListener("deviceready", download, true);
}

function download() {

    actualizarVersion();

    var networkState = navigator.connection.type;

    if(networkState === "wifi" || networkState === "2g" || networkState === "3g" || networkState === "4g")
    {
        //var remoteFile = "http://servicedatosabiertoscolombia.cloudapp.net/v1/Corpoica/productos?$format=json";
        //var remoteFile1 = "http://servicedatosabiertoscolombia.cloudapp.net/v1/Corpoica/organismos?$format=json";

        /*var remoteFile = "https://dl.dropboxusercontent.com/u/75467020/TATB_Productos2.json";
        var remoteFile1 = "https://dl.dropboxusercontent.com/u/75467020/TATB_EtapasCicloFenologico2.json";
        var remoteFile2 = "https://dl.dropboxusercontent.com/u/75467020/TATB_PartesPlanta2.json";
        var remoteFile3 = "https://dl.dropboxusercontent.com/u/75467020/TATB_OrganismosProdEtapa2.json";
        var remoteFile4 = "https://dl.dropboxusercontent.com/u/75467020/TATB_Organismos2.json";
        var remoteFile5 = "https://dl.dropboxusercontent.com/u/75467020/TATB_OrganismosSubSec2.json";*/

        var remoteFile = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_Productos2.json";
        var remoteFile1 = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_EtapasCicloFenologico2.json";
        var remoteFile2 = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_PartesPlanta2.json";
        var remoteFile3 = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_OrganismosProdEtapa2.json";
        var remoteFile4 = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_Organismos2.json";
        var remoteFile5 = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_OrganismosSubSec2.json";
        var remoteFile6 = "https://dl.dropboxusercontent.com/u/105758706/json-Dr.Agro/TATB_TipsDrAgro.json";
        var remoteFile7 = "https://dl.dropboxusercontent.com/u/75467020/TATB_ProductosEtapaPlanta.json";
        var remoteFile8 = "https://dl.dropboxusercontent.com/u/75467020/TATB_ProductosEtapa.json";
        var remoteFile9 = "https://dl.dropboxusercontent.com/u/75467020/TATB_Fotos2.json";

        for(var i=0 ; i<10; i++)
        {
            if(i == 0)
            {
                var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1);
                //var localFileName = remoteFile.substring(remoteFile.lastIndexOf('/') + 1, remoteFile.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_Productos2.json";
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
            else if(i == 1)
            {
                var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_EtapasCicloFenologico2.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile1),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 2)
            {
                var localFileName = remoteFile2.substring(remoteFile2.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                //alert(localFileName);
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_PartesPlanta2.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile2),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 3)
            {
                var localFileName = remoteFile3.substring(remoteFile3.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_OrganismosProdEtapa2.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile3),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 4)
            {
                var localFileName = remoteFile4.substring(remoteFile4.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_Organismos2.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile4),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 5)
            {
                var localFileName = remoteFile5.substring(remoteFile5.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_OrganismosSubSec2.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile5),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 6)
            {
                var localFileName = remoteFile6.substring(remoteFile6.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_TipsDrAgro.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile6),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 7)
            {
                var localFileName = remoteFile7.substring(remoteFile7.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_ProductosEtapaPlanta.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile7),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else if(i == 8)
            {
                var localFileName = remoteFile8.substring(remoteFile8.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_ProductosEtapa.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile8),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }
            else
            {
                var localFileName = remoteFile9.substring(remoteFile9.lastIndexOf('/') + 1);
                //var localFileName = remoteFile1.substring(remoteFile1.lastIndexOf('/') + 1, remoteFile1.lastIndexOf('?')) + ".json";
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {

                    fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
                        //var localPath = fileEntry.fullPath;
                        var localPath = "TATB_Fotos2.json";
                        if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                            localPath = localPath.substring(7);
                        }
                        var ft = new FileTransfer();
                        ft.download(encodeURI(remoteFile9),
                        fileSystem.root.toURL() + localPath, function(entry) {

                        }, fail);
                    }, fail);

                }, fail);
            }

        }

        window.localStorage.setItem('launchCount', 1);
        document.location.href="adminCultivo.html";

    }
    else
    {
        alert("Debe tener conexión a internet");
    }
}

function fail(error) {
    console.log(error.code);
}

function actualizarVersion() {
    var db = window.openDatabase("bd_doctoragro", "1.0", "Guardar Producto", 100000);
    db.transaction(VersionActualizada, ErrorOperacion, OperacionEfectuada);
}

function VersionActualizada(tx) {
    tx.executeSql('UPDATE versiones SET numero = 1 WHERE version_id = 1');
}

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
