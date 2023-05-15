import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faGuitar, faHome, faMusic, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IPlaylist } from 'src/app/Interfaces/IPlaylist';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-painel-esquerdo',
  templateUrl: './painel-esquerdo.component.html',
  styleUrls: ['./painel-esquerdo.component.scss']
})
export class PainelEsquerdoComponent implements OnInit {

  menuSelecionado = 'Home';

  playlists: IPlaylist[] = [];

  // Icones
  homeIcone = faHome;
  pesquisarIcone = faSearch;
  artistaIcone = faGuitar;
  playlistIcone = faMusic;

  constructor(
    private router: Router,
    private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.buscarPlaylists();
  }

  botaoClick(botao: string){
    this.menuSelecionado = botao;
    if(this.menuSelecionado == 'Home'){
      this.router.navigateByUrl('player/home');
    } 
    if (this.menuSelecionado == 'Pesquisar')(
      this.router.navigateByUrl('player/pesquisar')
    )
    if (this.menuSelecionado == 'Artistas')(
      this.router.navigateByUrl('player/artistas')
    )
  }

  irParaPlaylist(playlistId: string){
    this.menuSelecionado = playlistId;
    this.router.navigateByUrl(`player/lista/playlist/${playlistId}`)
  }

  async buscarPlaylists(){
    this.playlists = await this.spotifyService.buscarPlaylistUsuario();
    // console.log("🚀 ~ this.playlists:", this.playlists);
  }
  

}
