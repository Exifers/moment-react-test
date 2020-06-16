import React, {useState, useEffect, useRef} from 'react'
import StackGrid from 'react-stack-grid'
import InfiniteScroll from 'react-infinite-scroller'
import { fetchMovies, fetchGenres, withConfiguration, fetchImageUrl } from '../api/api'
import disableScroll from 'disable-scroll'
import Movie from './Movie'
import MovieModal from './MovieModal'

// TODO have some image with same size in CDN to replace missing images
const MISSING_IMG_SRC = 'http://image.tmdb.org/t/p/w342/ygCQnDEqUEIamBpdQdDYnFfxvgM.jpg'

export function Movies({configuration}) {
  const [movies, setMovies] = useState([])
  const [modalOpened, setModalOpened] = useState(false)
  const [modalMovie, setModalMovie] = useState({})
  const [modalMovieImageSrc, setModalMovieImageSrc] = useState(MISSING_IMG_SRC)
  const [genres, setGenres] = useState([])

  const handleClickPoster = (movie, imageSrc) => {
    setModalMovie(movie)
    setModalMovieImageSrc(imageSrc)
    disableScroll.on()
    setModalOpened(true)
  }

  const handleCloseModal = () => {
    setModalOpened(false)
    setTimeout(() => {
      setModalMovie({})
      disableScroll.off()
    }, 500)
  }

  useEffect(() => {
    fetchMovies().then(response => {
      setMovies(response.data.results)
    })
    fetchGenres().then(response => {
      setGenres(response.data.genres)
    })
  }, [])

  const loadMoreMovies = (page) => {
    fetchMovies(page).then(response => {
      setMovies([
        ...movies,
        ...response.data.results
      ])
    })
  }

  return (
    <>
    <InfiniteScroll
      className='movies'
      pageStart={0}
      loadMore={loadMoreMovies}
      hasMore={true} // TODO handle end
      loader={null}
      >
      {movies.map(movie => (
        <Movie
          key={movie.id}
          movie={movie}
          genres={genres.filter(genre => movie.genre_ids.includes(genre.id))}
          configuration={configuration}
          onClick={handleClickPoster}
          scaled={movie.id === modalMovie?.id}
          />
      ))}
    </InfiniteScroll>
    <MovieModal
      movie={modalMovie}
      genres={genres.filter(genre => modalMovie.genre_ids?.includes(genre.id))}
      imageSrc={modalMovieImageSrc}
      isOpen={modalOpened}
      onRequestClose={handleCloseModal}
      />
    </>
  )
}

export default withConfiguration(Movies)
