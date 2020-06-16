import React, {useState, useEffect, useRef} from 'react'
import { fetchImageUrl } from '../api/api'

const MISSING_IMG_SRC = 'http://image.tmdb.org/t/p/w342/ygCQnDEqUEIamBpdQdDYnFfxvgM.jpg'

function Movie({movie, genres, configuration, scaled, onClick}) {
  const [imageSrc, setImageSrc] = useState(MISSING_IMG_SRC)

  useEffect(() => {
    fetchImageUrl(movie.id, configuration).then(setImageSrc)
  }, [])

  const handleClick = () => {
    onClick(movie, imageSrc)
  }

  // TODO aria label on img
  return (
    <div className='movie'>
      <img className={`movie__poster ${scaled ? 'movie__poster--scaled' : ''}`}
           src={imageSrc} tabIndex={0} onClick={handleClick}/>
      <div className='movie__desc'>
        <h3 className='movie__title'>{movie.title}</h3>
        <p className='movie__genres'>
          {genres.map(genre => genre.name).join(', ')}
        </p>
        <p className='movie__mark-votes'>
          <span className='movie__mark'>{movie.vote_average}/10</span><br/>
          <span className='movie__votes'>{movie.vote_count} votes</span>
        </p>
      </div>
    </div>
  )
}

Movie.defaultProps = {
  onClick: () => {}
}

export default Movie
