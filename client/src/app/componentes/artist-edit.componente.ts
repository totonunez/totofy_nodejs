import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../servicios/gloval';
import { UserService } from '../servicios/user.service';
import { Artist } from '../modelos/artist';
import { ArtistService } from '../servicios/artist.service';
import { UploadService } from '../servicios/upload.service';


@Component({
    selector: 'artist-edit',
    templateUrl: '../../views/artist-add.html',
    providers: [UserService,ArtistService,UploadService]
})

export class ArtistEditComponent implements OnInit{
    public titulo : string;
    public artist : Artist;
    public identity ;
    public token ;
    public url : string;
    public is_edit;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService:  UploadService,
        private _artistService: ArtistService
    ){
        this.titulo="Editar artista",
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('artist-edit.components.ts cargado');
        // Conseguir el listado de artistas
        this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params: Params)=>{
                let id= params['id'];

                this._artistService.getArtist(this.token, id).subscribe(
                    response =>{
                        if(!response.artist){
                            this._router.navigate(['/']);
                            console.log('falló tu wea');
                            
                        }else{
                            this.artist = response.artist;
                        }
                    },
                    error =>{
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                      var body = JSON.parse(error._body);
                    // this.errorMessage = body.message;
                      console.log(error);
                    }
                }

            );
        });

    }

    onSubmit(){
        console.log(this.artist);

        this._route.params.forEach((params: Params)=>{
            let id= params['id'];

            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response =>{

                    if(response.artist){
                        this.alertMessage ="error en el servidor"; 
                    }else{
                        this.alertMessage ="El artista se a actualizado correctamente!!";

                        this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id,[],this.filesToUpload,this.token,'image')
                        .then(
                            (result)=>{
                                this._router.navigate(['/artists',1])
                            },
                            (error)=>{
                                console.log(error);
                                
                            }
                        )
                        this.artist = response.artist;
                        this._router.navigate(['/editar-artista'], response.artist._id);
                    }
                },
                error =>{
                    var errorMessage = <any>error;

                    if(errorMessage != null){
                      var body = JSON.parse(error._body);
                    // this.errorMessage = body.message;
                      console.log(error);
                    }
                }
            );
        });

    }

    public filesToUpload: Array<File>
    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}