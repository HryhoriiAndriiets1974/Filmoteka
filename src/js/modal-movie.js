import * as basicLightbox from 'basiclightbox'
import { getRefs } from './get-refs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiService from './api';
import noImg from '../images/no-poster-available.jpeg';
import { Loading } from 'notiflix';
import axios from 'axios';
import 'basiclightbox/dist/basicLightbox.min.css';
// Firebase import
import { addFilmToFirebase } from './user-data'

// Firebase const
let filmType = '';
let filmId = 0;
const apiMainMovie = new ApiService();
const container = getRefs().gallery;
container.addEventListener('click', onContainerClick);


let ADD_TO_WATCHED_FILM = "add-to-watched-film";
let ADD_TO_QUEUE_FILM = "add-to-queue-film";


// let currentMovie = '';
const addToWachedFilms = [];
const addToQueueFilms = [];
export function onContainerClick(event) {
  const parent = event.target.closest('li').firstChild;
  const { id } = parent.dataset;
  if (!parent) {
    return;
  }

  event.preventDefault();
  
  apiMainMovie.getMainMovie(id).then(({ title, genres, date, poster, about, populanty, vote, votes, id }) => {
    const ganreList = genres.map((ganre) => ganre.name).join(', ');
    const genre_ids = genres.map((ganre) => ganre.id);
window.addEventListener('keydown', onImageClose);
  const currentMovie = basicLightbox.create(`
    <div class="current-movie">
        <button data-modal-close class="modal__close-button-cm">

        </button>

        <img  src="${posterPath(poster)}" class="current-movie__img">

        <div class="current-movie__info">

        <h2 class="current-movie__title"> ${event.target.alt}</h2>
        <div class="info__box">
        <ul class="info__name">
        <li class="current-movie__name"> Vote / Votes </li>
        <li class="current-movie__name"> Popularity </li>
        <li class="current-movie__name"> Original Title </li>
       <li class="current-movie__name"> Genre</li>
          </ul>

        <ul class="info__value">
      <li class="info__item"><p > <span class="current-movie__vote-data">${vote} </span><span class="current-movie__votes_slash">/</span> <span class="current-movie__votes-data">${votes}</span></p></li>
      <li class="info__item"><p class="current-movie__popularity-data">${populanty}</p></li>
      <li class="info__item"><p class="current-movie__original-title-data">${title}</p></li>
      <li class="info__item"><p class="current-movie__genre-data">${ganreList}</p></li>
      </ul></div>
        <div class="current-movie__about-section">
          <h3 class="current-movie__about"> ABOUT</h3>
          <p class="current-movie__about-data"> ${about} </p>
        </div>

        <div class="current-movie__btn-container">
        <button type = "button" class="current-movie_btn-add-to-watched btn">ADD TO WATCHED</button>
        <button type = "button" class="current-movie_btn-add-to-queue btn">ADD TO QUEUE</button>
        <button type = "button" class="current-movie_btn-add-to-queue btn trailer-btn">Trailer</button>
      </div>
    </div>`
      );

    currentMovie.show();


 function onImageClose(event) {
    if (event.code === 'Escape') {
      currentMovie.close();
      window.removeEventListener('keydown', onImageClose);
      btnModalClose.removeEventListener('click',addListnerCurrent );
    }
    }
    function addListnerCurrent() {
      currentMovie.close()
    }

    const btnModalClose = document.querySelector(".modal__close-button-cm");
  const btnAddToWatched = document.querySelector(".current-movie_btn-add-to-watched");
    const btnAddToQueue = document.querySelector(".current-movie_btn-add-to-queue")
    btnModalClose.addEventListener('click', addListnerCurrent);
  const currentMovieInfo = { id: id, original_title: title, release_date: date, poster_path: poster, genre_ids: genre_ids, vote_average: vote,
        vote_count: votes };
    const dataWatchinMovie = JSON.parse(localStorage.getItem("watched")) || addToWachedFilms;
    const dataQueueMovie = JSON.parse(localStorage.getItem("queue")) || addToQueueFilms;



    btnAddToWatched.addEventListener("click", (() => {
      const unicId = dataWatchinMovie.map(({ id }) => {
          if (id === currentMovieInfo.id) {
            return true
          }
      });
        if (unicId.find((item)=> item===true)) {
         return Notify.warning('You have already added this movie to Watched')
        }
        Notify.success('You added this movie to Watched')

        dataWatchinMovie.push(currentMovieInfo);

        localStorage.setItem('watched', JSON.stringify(dataWatchinMovie));

        localStorage.setItem(ADD_TO_WATCHED_FILM, JSON.stringify(dataWatchinMovie));
        // Firebase code
        filmType = 'watched';
        addFilmToFirebase(filmType, currentMovieInfo);


    }));


    btnAddToQueue.addEventListener("click", (() => {
      const unicIdQ = dataQueueMovie.map(({ id }) => {
        if (id === currentMovieInfo.id) {
            return true;
          }
      });
        if (unicIdQ.find((item)=> item===true)) {
        return Notify.warning('You have already added this movie to Queue')
        }
        Notify.success('You added this movie to Queue')
        dataQueueMovie.push(currentMovieInfo);

        localStorage.setItem('queue', JSON.stringify(dataQueueMovie));

        localStorage.setItem(ADD_TO_QUEUE_FILM, JSON.stringify(dataQueueMovie));
        // Firebase code
        filmType = 'queue';
        addFilmToFirebase(filmType, currentMovieInfo);

      }));


      const trailerBtn = document.querySelector('.trailer-btn');

      trailerBtn.addEventListener('click', event => {
        event.preventDefault();
        getTrailer(id);
      });

      window.addEventListener('keydown', e => {
        const trailerRef = document.querySelector('.basicLightbox');
        if (e.code === 'Escape' && !trailerRef) closeModal();
      });

    });

  function onImageClose(event) {
    if (event.code === 'Escape') {
      currentMovie.close();
      window.removeEventListener('keydown', onImageClose);
      btnModalClose.removeEventListener('click', ()=>{ currentMovie.close();});
    }
  }


  async function getTrailer(n) {
    try {
      Loading.arrows({
        svgColor: '#ff6b08',
        backgroundColor: 'rgba(0,0,0,0.25)',
        cssAnimation: true,
        cssAnimationDuration: 2000,
        clickToClose: true,
      });
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${n}/videos?&api_key=419c8d7d79cbcac22c5520f1ac14d2c7`);
      const trailer = await response.data.results[0].key;

      const trailerShow = basicLightbox.create(
        `<iframe width="1024" height="630" style="border: none;" src='https://www.youtube.com/embed/${trailer}?autoplay=1&mute=1&controls=1' allow="fullscreen"></iframe>`,
      );
      trailerShow.show();
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && trailerShow.visible()) trailerShow.close();
      });
      Loading.remove();
    } catch (error) {
      console.error(error);
  }
    }; 
function posterPath(poster) {
  if (poster === null) {
    return noImg;
  }
  return `https://image.tmdb.org/t/p/w500${poster}`;
}
