import { SpotifyService } from 'src/app/services/spotify.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService
    ) { }
  
  ngOnInit(): void {
    this.obterMusicas();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
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
      await this.obterDadosArtista(id);
    }
  }

  async obterDadosPlaylist(playlistId: string){
    const playlistMusicas = await this.spotifyService.buscarMusicasPlaylist(playlistId);
    this.definirDadosPagina(playlistMusicas.nome, playlistMusicas.imagemUrl, playlistMusicas.musicas)
  }

  async obterDadosArtista(artistaId: string){
    
  }

  definirDadosPagina(bannerTexto: string, bannerImage: string, musicas: IMusica[]){
    this.bannerImagemUrl = bannerImage;
    this.bannerTexto = bannerTexto;
    this.musicas = musicas;
  }

}
