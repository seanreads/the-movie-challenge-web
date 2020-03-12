import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {

  const [movies, setMovies] = useState([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:3000/movies");
      const data = await response.json();
      const results = data.results
      setMovies(results)
    }
    fetchData();
  }, []); // a la ComponentDidMount behavior

  // Reverse sort by average rating
  const ratedMovies = movies.sort((a, b) => parseFloat(b.vote_average) - parseFloat(a.vote_average))

  const rows = ratedMovies.map((movie) => {
    return (<tr>
              <td key={movie.id}><img alt="poster" src={'http://image.tmdb.org/t/p/w300/' + movie.backdrop_path} /></td>
              <td key={movie.id}>{movie.title}</td>
              <td key={movie.id}>{movie.release_date}</td>
              <td key={movie.id}>{movie.vote_average}</td>
            </tr>)
  });

  return(
    <div>
      <h1>Today's Trending Movies</h1>
      <table>
      <tbody>
        <tr>
          <td>{rows}</td><td></td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}

export default App;
