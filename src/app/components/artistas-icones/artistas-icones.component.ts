import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { newArtista } from 'src/app/Common/factories';
import { IArtista } from 'src/app/Interfaces/IArtista';
import { IPlaylist } from 'src/app/Interfaces/IPlaylist';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-artistas-icones',
  templateUrl: './artistas-icones.component.html',
  styleUrls: ['./artistas-icones.component.scss']
})
export class ArtistasIconesComponent implements OnInit {

  artistaSelecionado = ''

    topArtista: IArtista[] = []  
    playlists: IPlaylist[] = [];
  
    constructor(
      private spotifyService: SpotifyService,
      private router: Router,) {
  
     }
  
    ngOnInit(): void {
      this.buscarArtista();
      
    }
  
    async buscarArtista(){
      const artistas = await this.spotifyService.buscarTopArtistas();
      console.log("🚀 ~ artistas:", artistas)
      
      if(!!artistas){
        this.topArtista = artistas;
      }
    }

    irParaPlaylist(playlistId: string){
      this.artistaSelecionado = playlistId;
      this.router.navigateByUrl(`player/lista/artista/${playlistId}`)
    }
    
    // async playlistArtista(){
    //   this.playlists = await this.spotifyService.buscarPlaylistUsuario();
    //   console.log("🚀 ~ this.playlists:", this.playlists)
    // }
  
  }
