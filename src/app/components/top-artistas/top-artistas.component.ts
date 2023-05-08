import { IArtista } from 'src/app/Interfaces/IArtista';
import { SpotifyService } from './../../services/spotify.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-artistas',
  templateUrl: './top-artistas.component.html',
  styleUrls: ['./top-artistas.component.scss']
})
export class TopArtistasComponent implements OnInit {

  artistas: IArtista[] = [];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.buscarTopArtistas();
  }

  async buscarTopArtistas(){
    this.artistas = await this.spotifyService.buscarTopArtistas(1,5);
    console.log("🚀 ~ this.artistas25:", this.artistas)
  }
}
