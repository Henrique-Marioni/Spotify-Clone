import { SpotifyService } from 'src/app/services/spotify.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-musica-artista',
  templateUrl: './lista-musica-artista.component.html',
  styleUrls: ['./lista-musica-artista.component.scss']
})
export class ListaMusicaArtistaComponent implements OnInit {

  bannerImagemUrl ='';
  bannerTexto = '';

  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();
  playIcone = faPlay;

  subs: Subscription[] = []
  title: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService
    ) { }

    ngOnInit(): void {
      this.obterMusicas();
      this.obterMusicaAtual();
  
    }
  
    ngOnDestroy(): void {
      this.subs.forEach(sub => sub.unsubscribe())
    }

  obterMusicaAtual(){
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musicaAtual = musica;
    });

    this.subs.push(sub);
  }

  obterMusicas(){
    const sub = this.activatedRoute.paramMap
       .subscribe(async params =>{
          const tipo = params.get('tipo');
          const id = params.get('id');
          await this.obterDadosPagina(tipo, id)
       })
 
       this.subs.push(sub);
   }

   async obterDadosPagina(tipo: string, id: string){
    if(tipo === 'playlist'){
      await this.obterDadosPlaylist(id);
    } else{
      await this.fetchTopTracks(id);
    }
  }

  async obterDadosPlaylist(playlistId: string){
    const playlistMusicas = await this.spotifyService.buscarMusicasPlaylist(playlistId);
    console.log("🚀 ~ playlistMusicas:", playlistMusicas)
    this.definirDadosPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas)
    this.title = 'Musicas Playlist: ' + playlistMusicas.nome;

  }

  async fetchTopTracks(artistId: string) {
    const teste = await this.spotifyService.getTopTracksByArtist(artistId).subscribe(
      (response: any) => {
        this.musicas = response.tracks;
      },
      (error: any) => {
        console.error('Erro ao obter as principais faixas do artista:', error);
      }
    );
    console.log("🚀 ~ teste:", teste)
  }

  // async obterDadosArtista(artistaId: string){
  //   const playlistMusicas = await this.spotifyService.buscarMusicasArtistas(artistaId);
  //   console.log("🚀 ~ playlistMusicas:", playlistMusicas)
  //   this.definirDadosPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas)
  //   this.title = 'Musicas Playlist: ' + playlistMusicas.nome;
  // }

  definirDadosPagina(bannerTexto: string, bannerImage: string, musicas: IMusica[]){
    this.bannerImagemUrl = bannerImage;
    this.bannerTexto = bannerTexto;
    this.musicas = musicas;
  }

  obterArtistas(musica: IMusica){
    return musica.artistas.map(artista => artista.nome).join(', ');
  }

  async executarMusica(musica: IMusica){
    await this.spotifyService.executarMusica(musica.id);
    this.playerService.definirMusicaAtual(musica);
  }

}
