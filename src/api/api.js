import React, {useState, useEffect} from 'react'
import {SET_CONFIGURATION} from '../actions/api'
import axios from 'axios'
import { connect } from 'react-redux'

const API_KEY = 'aa2b902702fc1769c39c8cf58aeba8a0'
const API_BASE_URL = 'https://api.themoviedb.org/3'

const LOCAL_STORAGE_KEY = 'api_config'
const MAX_AGE_MS = 1000 * 3600 * 24 * 365 // one year in ms

function updateConfiguration() {
  const url = API_BASE_URL + `/configuration?api_key=${API_KEY}`
  return axios
    .get(url)
    .then(response => {
      const configuration = response.data
      const data = {createdAt:Date.now(), configuration}
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))

      return Promise.resolve(configuration)
    })
}

export function updateAndGetConfiguration() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!data) {
    return updateConfiguration()
  }

  const { createdAt, configuration } = JSON.parse(data)
  if (Date.now() - createdAt > MAX_AGE_MS) {
    return updateConfiguration()
  }

  return Promise.resolve(configuration)
}

/** A HOC helper
 *  When put on a component, it will fill the API configuration slot in the Redux store
 *  before rendering the component. It will also try to see if the configuration has
 *  been saved in localStorage before, and if it's not out of date. Otherwise it will
 *  fetch it.
 */
export const withConfiguration = (WrappedComponent) => {

  const mapStateToProps = state => ({
    configuration: state.api.configuration
  })

  function Component({configuration, dispatch, ...props}) {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (!configuration) {
        updateAndGetConfiguration().then(conf => {
          dispatch({type:SET_CONFIGURATION, payload:conf})
          setLoading(false)
        })
        return
      }
      setLoading(false)
    }, [])

    if (loading) {
      return <div>Loading...</div>
    }

    return (
      <WrappedComponent configuration={configuration} {...props}/>
    )
  }

  return connect(mapStateToProps)(Component)
}

export function fetchGenres() {
  const url = API_BASE_URL + `/genre/movie/list?api_key=${API_KEY}`
  return axios.get(url)
}


export function fetchMovies(page=1) {
  const url = API_BASE_URL + `/movie/popular?api_key=${API_KEY}&page=${page.toString()}`
  return axios.get(url)
}

export function fetchImageUrl(movieId, configuration) {
  const baseUrl = configuration.images.base_url
  const posterSize = configuration.images.poster_sizes[3] // TODO clever size picking

  const url = API_BASE_URL + `/movie/${movieId.toString()}/images?api_key=${API_KEY}`
  return axios
    .get(url)
    .then(response => {
      const images = response.data
      if(images.posters.length) {
        let poster = images.posters.find(poster => poster.iso_639_1 === 'en')
        if (!poster) {
          poster = images.posters[0]
        }
        const filePath = poster.file_path

        const imgUrl = baseUrl + posterSize + filePath
        return Promise.resolve(imgUrl)
      }
    })
}
