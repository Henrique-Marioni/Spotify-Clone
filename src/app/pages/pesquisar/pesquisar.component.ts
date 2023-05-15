import { Component, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { addMilliseconds } from 'date-fns';
import { Subscription } from 'rxjs';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styleUrls: ['./pesquisar.component.scss']
})
export class PesquisarComponent implements OnInit {

  playIcone= faPlay;

  musicas: IMusica[] = []
  musicaAtual: IMusica = newMusica();

  subs: Subscription[]=[]

  resultados: any[];
  query: any;

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService
    ) { }

    ngOnInit(): void {
      this.obterMusicas();
      this.obterMusicalAtual()
    }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  } 

  async obterMusicas(){
    this.musicas =  await this.spotifyService.buscarMusicas()
  }

  obterArtistas(musica:IMusica){
    return musica.artistas.map(artista => artista.nome).join(', ');
  }

  async executarMusica(musica:any){
    await this.spotifyService.executarMusica(musica.uri);
    this.playerService.definirMusicaAtual(musica);
  }

  obterMusicalAtual(){
    const sub = this.playerService.musicaAtual.subscribe(musica => {
      this.musicaAtual = musica;
    }); 

    this.subs.push(sub);
  }

  pesquisar(query: string) {
    this.spotifyService.pesquisar(query)
      .subscribe((data: any) => {
        this.resultados = data.tracks.items;
        console.log("🚀 ~ this.resultados:", this.resultados)
      });
  }
}
  
