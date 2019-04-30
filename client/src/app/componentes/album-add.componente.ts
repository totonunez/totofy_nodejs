import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../servicios/gloval';
import { UserService } from '../servicios/user.service';
import { ArtistService} from '../servicios/artist.service';
import { Artist } from '../modelos/artist';
import { Album} from '../modelos/album';

@Component({
    selector: 'album-add',
    templateUrl: '../../views/album-add.html',
    providers: [UserService,ArtistService]
})

export class AlbumAddComponent implements OnInit{

    public titulo : string;
    public artist : Artist;
    public album : Album;
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
        this.titulo="Crear Nuevo Album",
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','','','','');

    }

    ngOnInit(){
        console.log('album-add.components.ts cargado');
        // Conseguir el listado de artistas
    }
    
}