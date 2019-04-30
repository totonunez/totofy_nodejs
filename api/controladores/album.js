'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../modelos/artist');
var Album = require('../modelos/album');
var Song = require('../modelos/song');

function getAlbum(req,res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path:'artist'}).exec((err,album)=>{ 
        if(err){
            res.status(500).send({message:'Error en la petición. '});
        }else{
            if(!album){
                res.status(404).send({message:'El album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function saveAlbum(req,res){

    var album = new Album();

    var params =  req.body;

    console.log(params);

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save( (err,albumStored) => {
        if(err){
            res.status(500).send({message:"error en el servidor"});
        }else{
            if(!albumStored){
                res.status(404).send({message:"No se ha registrado el album"});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });


}

function getAlbums(req,res){

    var artistId = req.params.artist;

    if(!artistId){
        //Sacar todos los albums de la bbdd
        var find = Album.find({}).sort('title');
    }else{
        //Sacar los albums de un artista concreto de la bbdd
        var find = Album.find({artist:artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err,albums) => {

        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message:' No hay albums !!!'});
            }else{
                res.status(200).send({ albums });
            }
        }
    });
}

function updateAlbum(req,res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId,update,(err,albumUpdated) => {
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message:'No se ha podido actualizar el album'});
            }else{
                res.status(200).send({album:albumUpdated});
            }
        }
    });
}

function deleteAlbum(req,res){

    var albumId = req.params.id;

    Album.findByIdAndDelete(albumId,(err,albumRemoved) =>{
        if(err){
            res.status(500).send({message:'Error al eliminar el album'});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            }else{

                Song.find({album: albumRemoved._id}).remove((err,songRemoved) =>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la cancion'});
                    }else{
                        if(!songRemoved){
                            res.status(400).send({message: 'La canción no ha podido ser eliminada'});
                        }else{
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req,res){
    var albumId = req.params.id;
    var file_name = 'No subido ...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split  = file_name.split('\.');

        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated)=>{
                
                if(!albumUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el album'});
                }else{
                    res.status(200).send({album:albumUpdated});
                }            
            });

        }else{
            res.status(200).send({message:'Extension del archivo no valida'})
        }

        console.log(file_path);
    }else{
        res.status(200).send({message:'No se ha subido la imagen '});
    }
}

function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe imagen....'});
        }
    });

}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
    
};