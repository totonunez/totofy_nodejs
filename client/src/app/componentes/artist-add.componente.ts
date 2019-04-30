import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../servicios/gloval';
import { UserService } from '../servicios/user.service';
import { ArtistService} from '../servicios/artist.service';
import { Artist } from '../modelos/artist';

@Component({
    selector: 'artist-add',
    templateUrl: '../../views/artist-add.html',
    providers: [ArtistService]
})

export class ArtistAddComponent implements OnInit{

    public titulo : string;
    public artist : Artist;
    public identity ;
    public token ;
    public url : string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.titulo="Crear Nuevo Artista",
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('','','');

    }

    ngOnInit(){
        console.log('artist-add.components.ts cargado');
        // Conseguir el listado de artistas
    }
    
    onSubmit(){
        console.log(this.artist);
        this._artistService.addArtist(this.token,this.artist).subscribe(
            response =>{
                this.artist=response.artist;

                if(!response.artist){
                    this.alertMessage ="error en el servidor"; 
                }else{
                    this.alertMessage ="El artista se a creado exitosamente";
                    this.artist = response.artist;
                    this._router.navigate(['/editar-artista', response.artist._id]);
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

    }
}