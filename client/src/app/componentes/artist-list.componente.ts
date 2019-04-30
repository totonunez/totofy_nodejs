import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../servicios/gloval';
import { UserService } from '../servicios/user.service';
import { ArtistService } from '../servicios/artist.service';
import { Artist } from '../modelos/artist';

@Component({
    selector: 'artist-list',
    templateUrl: '../../views/artist-list.html',
    providers: [UserService,ArtistService]
})

export class ArtistListComponent implements OnInit{
    public titulo : string;
    public artists : Artist[];
    public identity ;
    public token ;
    public url : string;
    public next_page;
    public prev_page;
        
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo="Artistas",
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit(){
        console.log('artist-list.components.ts cargado');
        // Conseguir el listado de artistas
        this.getArtists();
    }

    getArtists(){
        this._route.params.forEach((params:Params)=>{
            let page =+ params ['page'];

            if(!page){
                page=1;
            }else{
                this.next_page=page+1;
                this.prev_page=page-1;

                if(this.prev_page == 0){
                    this.prev_page =1;
                }

                this._artistService.getArtists(this.token,page).subscribe(
                    response =>{
                        if(!response.artists){
                            this._router.navigate(['/']);
                            console.log('falló tu wea');
                            
                        }else{
                            this.artists = response.artists;
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
                )
            }
        });
    }
    public confirmado;

    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelArtist(){
        this.confirmado = null;
    }

    onDeleteArtist(id){
        this._artistService.deleteArtist(this.token,id).subscribe(
            response =>{
                if(!response.artist){
                    console.log('falló tu wea');
                }else{
                    this.artists = response.artists;
                }
            },
            error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
            // this.errorMessage = body.message;
              console.log(error);
            }
        })
    }
}