import React from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#__next')

const modalStyles = {
  content : {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgb(13,13,07)',
    boxShadow: '0px 5px 60px 15px rgba(221,91,27,0.11)',
    width: 342 * 2,
    padding: 0,
    border: 0,
    display: 'flex',
    borderRadius: 4
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.8)'
  }
}

function MovieModal({movie, genres, imageSrc, ...props}) {
  return (
    <Modal
      closeTimeoutMS={500}
      style={modalStyles}
      {...props}
      >
      <div className='modal__desc'>
        <h3 className='movie__title'>{movie.title}</h3>
        <p className='movie__genres'>
          {genres.map(genre => genre.name).join(', ')}
        </p>
        <p className='movie__overview'>{movie.overview}</p>
        <p className='movie__mark-votes'>
          <span className='movie__mark'>{movie.vote_average}/10</span><br/>
          <span className='movie__votes'>{movie.vote_count} votes</span>
        </p>
        {movie.release_date
          && (
            <p className='movie__release-date'>
              Released {movie.release_date}
            </p>
          )}
      </div>
      <div className='modal__img'>
        <img src={imageSrc}/>
      </div>
    </Modal>
  )
}

export default MovieModal
