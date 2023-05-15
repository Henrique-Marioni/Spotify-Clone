import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyConfiguration } from 'src/environments/environment';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../Interfaces/IUsuario';
import { SpotifyArtistaParaArtista, SpotifyPLaylistParaPLaylist, SpotifySinglePLaylistParaPLaylist, SpotifyTrackParaMusica, SpotifyUserParaUsuario } from '../Common/spotifyHelper';
import { IPlaylist } from '../Interfaces/IPlaylist';
import { Router } from '@angular/router';
import { IArtista } from '../Interfaces/IArtista';
import { IMusica } from '../Interfaces/IMusica';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario;
  musicaArtista: IArtista;
  private apiUrl = 'https://api.spotify.com/v1';
  spotifyService: any;
  tracks: any;

  constructor(
    private router: Router,
    private http: HttpClient
    ) { 
    this.spotifyApi = new Spotify();
  }

  async inicializarUsuario(){
    if(!!this.usuario)
      return true;
    
    const token = localStorage.getItem('token');

    if(!token)
      return false;

    try{
     this.definirAccessToken(token);
     await this.obterSpotifyUsuario();
     return !!this.usuario;

    }catch(ex){
      return false;
    }
  }

  async obterSpotifyUsuario(){
    const userInfo = await this.spotifyApi.getMe();
    this.usuario = SpotifyUserParaUsuario(userInfo);
  }

  obterUrlLogin() {
    const authEndpoint = `${SpotifyConfiguration.authEndpoint}?`;
    const clientId = `client_id=${SpotifyConfiguration.clientId}&`;
    const redirectUrl = `redirect_uri=${SpotifyConfiguration.redirectUrl}&`;
    const scopes = `scope=${SpotifyConfiguration.scopes.join('%20')}&`;
    const responseType = `response_type=token&show_dialog=true`;
    return authEndpoint + clientId + redirectUrl + scopes + responseType

  }

  obterTokenUrlCallback(){
    if (!window.location.hash)
      return '';
    
    const params = window.location.hash.substring(1).split('&');
    return params[0].split('=')[1];
  }

  definirAccessToken(token: string){
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
    // this.spotifyApi.skipToNext();
  }

  async buscarPlaylistUsuario(offset = 0, limit = 50): Promise<IPlaylist[]>{
    const playlists = await this.spotifyApi.getUserPlaylists(this.usuario.id, { offset, limit });
    // console.log("🚀 ~ playlists:", playlists)
    return playlists.items.map(SpotifyPLaylistParaPLaylist);

  }

  // async buscarMusicasArtista(offset = 0, limit = 50): Promise<IMusica[]>{
  //   const musicas = await this.spotifyApi.getArtistTopTracks()
  //   return musicas.items.map(x => SpotifyTrackParaMusica(x.track));
  // }

  async buscarTopArtistas(offset = 1,limit = 10):Promise<IArtista[]>{
    const artistas = await this.spotifyApi.getMyTopArtists({offset, limit})
    return artistas.items.map(SpotifyArtistaParaArtista)

  }  

  async buscarMusicas(offset = 3, limit = 50):Promise<IMusica[]>{
    const musicas = await this.spotifyApi.getMySavedTracks({offset, limit})
    return musicas.items.map(x => SpotifyTrackParaMusica(x.track));
  }

  async executarMusica(musicaId: string){
    console.log('musica',musicaId)
    await this.spotifyApi.queue(musicaId);
    await this.spotifyApi.skipToNext();
  }

  async obterMusicaAtual(): Promise<IMusica>{
    const musicaSpotify = await this.spotifyApi.getMyCurrentPlayingTrack();
    let resultado = SpotifyTrackParaMusica(musicaSpotify.item); 
    resultado.isPlay = musicaSpotify.is_playing;
    return  resultado
  } 

  async voltarMusica(){
    this.spotifyApi.skipToPrevious();
  }

  async proximaMusica(){
    this.spotifyApi.skipToNext();
  }
  async iniciarMusica(){
    this.spotifyApi.play();
  }
  async pausarMusica(){
    this.spotifyApi.pause();
  }

  async buscarMusicasPlaylist(playlistId: string, offset = 0, limit = 50){
    const playlistSpotify = await this.spotifyApi.getPlaylist(playlistId);
    console.log("🚀 ~ playlistSpotify:", playlistSpotify)
    if(!playlistSpotify)
      return null;
    
      const playlist = SpotifySinglePLaylistParaPLaylist(playlistSpotify);
      console.log("🚀 ~ playlist:", playlist)

      const musicasSpotify = await this.spotifyApi.getPlaylistTracks(playlistId, {offset, limit})
      console.log("🚀 ~ musicasSpotify:", musicasSpotify)

      playlist.musicas = musicasSpotify.items.map(musica => SpotifyTrackParaMusica(musica.track as SpotifyApi.TrackObjectFull))

      return playlist
  }

  async buscarMusicasArtistas(artistId: string){
    const artistaSpotify = await this.spotifyApi.getArtist(artistId);
    const playlistSpotify = await this.spotifyApi.getArtistTopTracks(artistId, 'BR');
    console.log("🚀 ~ playlistSpotify:", playlistSpotify)
    if(!playlistSpotify)
      return null;
      
      const artista = SpotifyArtistaParaArtista(artistaSpotify)
      

      artista.musicas = playlistSpotify.tracks.map(musica => SpotifyTrackParaMusica(musica))

      return artista

  }

  getTopTracksByArtist(artistId: string) {
    const url = `${this.apiUrl}/artists/${artistId}/top-tracks`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')};`);
    const params = new HttpParams().set('market', 'BR'); // Substitua 'US' pelo código do mercado desejado

    return this.http.get<any>(url, { headers, params });
  }

  pesquisar(query: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')};`
    });

    const url = `${this.apiUrl}/search?q=${query}&type=track`;

    return this.http.get(url, { headers });
  
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login'])
  }
}
