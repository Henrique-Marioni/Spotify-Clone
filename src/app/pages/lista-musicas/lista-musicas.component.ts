import { SpotifyService } from 'src/app/services/spotify.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-lista-musicas',
  templateUrl: './lista-musicas.component.html',
  styleUrls: ['./lista-musicas.component.scss']
})
export class ListaMusicasComponent implements OnInit, OnDestroy {

  bannerImagemUrl ='';
  bannerTexto = '';

  musicas: IMusica[] = [];
  musicaAtual: IMusica = newMusica();
  playIcone = faPlay;

  subs: Subscription[] = []
  title: string;
  tracks: any;

  constructor(
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService
    ) { }
  
  ngOnInit(): void {
    const artistId = this.route.snapshot.params['id'];
    this.obterMusicas();
    this.obterMusicaAtual();
    this.obterDadosArtista(artistId);

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
      console.log("🚀 ~ this.subs:", this.subs)
  }

  async obterDadosPagina(tipo: string, id: string){
    if(tipo === 'playlist'){
      await this.obterDadosPlaylist(id);
      console.log('caiu1')
    } else{
      await this.obterDadosArtista(id);
      console.log('caiu')
    }
  }

  async obterDadosPlaylist(playlistId: string){
    const playlistMusicas = await this.spotifyService.buscarMusicasPlaylist(playlistId);
    console.log("🚀 ~ playlistMusicas:", playlistMusicas)
    this.definirDadosPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas)
    this.title = 'Musicas Playlist: ' + playlistMusicas.nome;

  }



  async obterDadosArtista(artistId: string){
    const playlistMusicas = await this.spotifyService.buscarMusicasArtistas(artistId)
    console.log("🚀 ~ playlistMusicas:", playlistMusicas)
    this.definirDadosPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas)
    this.title = 'Musicas Playlist: ' + playlistMusicas.nome;
  }

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
