import { Component } from '@angular/core';
import { Routes } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { PlayerComponent } from "./player.component";
import { ListaMusicasComponent } from '../lista-musicas/lista-musicas.component';
import { PesquisarComponent } from '../pesquisar/pesquisar.component';
import { ArtistasComponent } from '../artistas/artistas.component';
import { ListaMusicaArtistaComponent } from '../lista-musica-artista/lista-musica-artista.component';

export const PlayerRotas: Routes = [
    {
        path: '',
        component: PlayerComponent,
        children:[
            {
                path:'home',
                component:HomeComponent
            },
            {
                path:'pesquisar',
                component:PesquisarComponent
            },
            {
                path:'artistas',
                component:ArtistasComponent
            },
            {
                path:'lista/:tipo/:id',
                component:ListaMusicasComponent
            },
            {
                path:'/artista/:tipo/:id',
                component:ListaMusicaArtistaComponent
            },
        ]
    }
]