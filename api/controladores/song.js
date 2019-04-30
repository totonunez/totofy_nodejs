'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../modelos/artist');
var Album = require('../modelos/album');
var Song = require('../modelos/song');

function getSong(req,res){

    var songId = req.params.id;

    Song.findById(songId).populate({path:'album'}).exec((err,song)=>{ 
        if(err){
            res.status(500).send({message:'Error en la petición. '});
        }else{
            if(!song){
                res.status(404).send({message:'La canción no existe'});
            }else{
                res.status(200).send({song});
            }
        }
    });

}

function saveSong(req,res){

    var song = new Song();

    var params =  req.body;

    console.log(params);

    song.number = params.number;
    song.name = params.name;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message:"Error al guardar el song"});
        }else{
            if(!songStored){
                res.status(404).send({message:"No se ha registrado el song"});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });


}

function getSongs(req,res){

    var albumId = req.params.album;

    if(!albumId){
        //Sacar todos los albums de la bbdd
        var find = Song.find({}).sort('name');
    }else{
        //Sacar los Songs de un songa concreto de la bbdd
        var find = Song.find({album:albumId}).sort('number');
    }

    find.populate({
        path:'album',
        populate:{
            path:'artist',
            model: 'Artist'
        }
    }).exec((err,songs) => {

        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!songs){
                res.status(404).send({message:' No hay canciones !!!'});
            }else{
                res.status(200).send({ songs });
            }
        }
    });
}

function updateSong(req,res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId,update,(err,songUpdated) => {
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else{
            if(!songUpdated){
                res.status(404).send({message:'No se ha podido actualizar el album'});
            }else{
                res.status(200).send({song:songUpdated});
            }
        }
    });
}

function deleteSong(req,res){

    var songId = req.params.id;

    Song.findByIdAndDelete(songId,(err,songRemoved)=>{
        if(err){
            res.status(500).send({message:'Error al eliminar la cancion'});
        }else{
            if(!songRemoved){
                res.status(404).send({message:'No a sido eliminado'});
            }else{
                res.status(200).send({user:songRemoved});
            }
        }
    });
}

function uploadSong(req,res){
    var songId = req.params.id;
    var file_name = 'No subido ...';

    if(req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split  = file_name.split('\.');

        var file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'wav'){

            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated)=>{
                
                if(!songUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el artista'});
                }else{
                    res.status(200).send({song:songUpdated});
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

function getSongFile(req,res){
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe el fichero ....'});
        }
    });

}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    getSongFile,
    uploadSong
};