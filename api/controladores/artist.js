'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../modelos/artist');
var Album = require('../modelos/album');
var Song = require('../modelos/song');

function getArtist(req,res){
    var artistId = req.params.id;

    Artist.findById(artistId,(err,artist)=>{
        if(err){
            res.status(500).send({message:'Error en la petición. '});
        }else{
            if(!artist){
                res.status(404).send({message:'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}

function saveArtist(req,res){
    var artist = new Artist();
    var params =  req.body;

    console.log(params);

    artist.name = params.name;
    artist.description = params.description;
    artist.email = params.email;
    artist.image = 'null';

    artist.save((err,artistStored)=>{
        if(err){
            res.status(500).send({message:"error al guardar el artista"});
        }else{
            if(!artistStored){
                res.status(404).send({message:"No se ha registrado el artista"});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    });


}

function getArtists(req,res){

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page  = 1;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err,artists,total){
        if(err){
            res.status(500).send({message: ' Error en la petición'});
        }else{
            if(!artists){
                res.status(404).send({message:' No hay artistas !!!'});
            }else{
                return res.status(200).send({
                    pages: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req,res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId,update,(err,artistUpdated)=>{
        if(err){
            res.status(500).send({message:'Error al actualizar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message:'No se ha podido actualizar el artista'});
            }else{
                res.status(200).send({user:artistUpdated});
            }
        }
    });
}

function deleteArtist(req,res){

    var artistId = req.params.id;

    Artist.findByIdAndDelete(artistId,(err,artistRemoved)=>{
        if(err){
            res.status(500).send({message:'Error al eliminar el artista'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message:'No a sido eliminado'});
            }else{
                res.status(200).send({user:artistRemoved});
            }
        }
    });
}

function uploadImage(req,res){
    var artistId = req.params.id;
    var file_name = 'No subido ...';

    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split  = file_name.split('\.');

        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated)=>{
                
                if(!artistUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el artista'});
                }else{
                    res.status(200).send({artist:artistUpdated});
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
    var path_file = './uploads/artists/'+imageFile;

    fs.exists(path_file, function(exists){
        if(exists){
            return res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe imagen....'});
        }
    });

}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};