import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  useHistory
} from 'react-router-dom';
import './App.css';

const THE_MOVIE_CHALLENGE_API = 'http://localhost:3000';
const THE_MOVIE_DB_IMAGES_BASE_URL = 'http://image.tmdb.org';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/movies" />
        </Route>
        <Route exact path="/movies">
          <Movies />
        </Route>
        <Route exact path="/movies/:id" component={Movie} />
      </Switch>
    </Router>
  )
}

const Movie = (props) => {

  let { id } = props.match.params;
  const [imageUrl, setImageUrl] = useState(null)
  const [title, setTitle] = useState(null)
  const [releaseDate, setReleaseDate] = useState(null)
  const [voteAverage, setVoteAverage] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${THE_MOVIE_CHALLENGE_API}/movies/${id}`);
      const data = await response.json();
      const { backdrop_path: imageUrl, 
              title, 
              release_date: releaseDate, 
              vote_average: voteAverage } = data
      setImageUrl(imageUrl);
      setTitle(title);
      setReleaseDate(releaseDate);
      setVoteAverage(voteAverage);
    }
    fetchData();
  }, [id]);

  return (
    <div>
      <div>
        <img alt="poster" src={`${THE_MOVIE_DB_IMAGES_BASE_URL}/t/p/w300/${imageUrl}`} />
      </div>
      <div>
        <p>Title: {title}</p>
        <p>Released: {releaseDate}</p>
        <p>Rating: {voteAverage}/10</p>
      </div>
      <Link to="/movies">&larr; Back to Movies</Link>
    </div>
  )

}

const Movies = () => {

  const [movies, setMovies] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${THE_MOVIE_CHALLENGE_API}/movies`);
      const data = await response.json();
      const results = data.results
      setMovies(results)
    }
    fetchData();
  }, []);

  // List highest rated first
  const ratedMovies = movies.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average))

  let history = useHistory();
  const handleClickMovie = id => history.push(`/movies/${id}`);  

  const rows = ratedMovies.map((movie) => {
    return (<tr onClick={() => handleClickMovie(movie.id)} key={movie.id}>
              <td><img alt="poster" src={`${THE_MOVIE_DB_IMAGES_BASE_URL}/t/p/w300/${movie.backdrop_path}`} /></td>
              <td>{movie.title}</td>
              <td>{movie.release_date}</td>
              <td>{movie.vote_average}</td>
            </tr>)
  });

  return(
    <div>
      <h1>Today's Trending Movies</h1>
      <table>
        <tbody>
        {rows}
        </tbody>
      </table>
    </div>
  )
}

export default App;