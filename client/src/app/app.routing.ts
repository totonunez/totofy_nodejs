import {ModuleWithProviders, Component} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

// import user
import {HomeComponent} from './componentes/home.componente';
import {UserEditComponent} from './componentes/user-edit.componente';

// import artistas
import {ArtistListComponent} from './componentes/artist-list.componente';
import {ArtistAddComponent} from './componentes/artist-add.componente';
import {ArtistEditComponent} from './componentes/artist-edit.componente';
import {ArtistDetailComponent} from './componentes/artist-detail.componente';

// importar albunes
import {AlbumAddComponent} from './componentes/album-add.componente';

const appRoutes: Routes=[
    // {path:'',redirectTo:'/artistas/1',pathMatch:'full'},
    {path: '', component:HomeComponent },
    {path:'artistas/:page', component:ArtistListComponent},
    {path: 'crear-artista', component:ArtistAddComponent},
    {path: 'editar-artista/:id', component:ArtistEditComponent},
    {path: 'artista/:id', component:ArtistDetailComponent},
    {path: 'crear-album: ',component: AlbumAddComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: '**', component:HomeComponent}
];


export const appRoutingProviders: any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);