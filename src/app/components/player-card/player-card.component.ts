import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { faPause, faPlay, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { newMusica } from 'src/app/Common/factories';
import { IMusica } from 'src/app/Interfaces/IMusica';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit, OnDestroy {

  musica: IMusica = newMusica();
  subs: Subscription[] = []

  //Icones
  anteriorIcone = faStepBackward;
  proximoIcone = faStepForward;
  playPause = faPlay;

  constructor(private playerService: PlayerService) { }
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  ngOnInit(): void {
    this.obterMusicaTocando()
  }

  async obterMusicaTocando(){
    const sub = this.playerService.musicaAtual.subscribe(musica =>{
      this.musica = musica;
      if(this.musica.isPlay){
        this.playPause = faPause
      }else{
        this.playPause = faPlay
      }

    });
   

    this.subs.push(sub)
  }
  

  voltarMusica(){
    this.playerService.voltarMusica();
    this.playPause = faPause   
  }
  proximaMusica(){
    this.playerService.proximaMusica();  
    this.playPause = faPause   
  }
  iniciarPausarMusica(){
    if(this.playPause == faPlay){
      this.playerService.iniciarMusica();   
      this.playPause = faPause
    } else {
      this.playerService.pausarMusica();   
      this.playPause = faPlay   
     }
  }

}
