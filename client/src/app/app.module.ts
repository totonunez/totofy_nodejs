import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http'
import {routing,appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';

import {UserEditComponent} from './componentes/user-edit.componente';
import {ArtistListComponent} from './componentes/artist-list.componente';
import {ArtistAddComponent} from './componentes/artist-add.componente';
import {HomeComponent} from './componentes/home.componente';
import {ArtistEditComponent} from './componentes/artist-edit.componente';
import {ArtistDetailComponent} from './componentes/artist-detail.componente';
import {AlbumAddComponent} from './componentes/album-add.componente';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
