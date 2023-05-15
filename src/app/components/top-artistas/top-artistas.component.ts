import { IArtista } from 'src/app/Interfaces/IArtista';
import { SpotifyService } from './../../services/spotify.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-top-artistas',
  templateUrl: './top-artistas.component.html',
  styleUrls: ['./top-artistas.component.scss']
})
export class TopArtistasComponent implements OnInit {

  artistas: IArtista[] = [];
  artistaSelecionado: string;

  constructor(
    private spotifyService: SpotifyService,
    private router: Router,) { }

  ngOnInit(): void {
    this.buscarTopArtistas();
  }

  async buscarTopArtistas(){
    this.artistas = await this.spotifyService.buscarTopArtistas(1,7);
    console.log("🚀 ~ this.artistas25:", this.artistas)
  }
  irParaPlaylist(playlistId: string){
    this.artistaSelecionado = playlistId;
    this.router.navigateByUrl(`player/lista/artista/${playlistId}`)
  }
}
