import '../styles/App.scss';
import '../styles/core/_reset.scss';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';
import getApiData from '../services/api';
import MovieSceneList from './MovieSceneList';
import MovieSceneDetail from './MovieSceneDetail';
import Filters from './Filters';
import Header from './Header';

function App() {
  const [wowData, setwowData] = useState([]);
  const [searchedMovie, setSearchedMovie] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [number, setNumber] = useState(50);

  useEffect(() => {
    getApiData(number).then((wowData) => {
      console.log(wowData);
      setwowData(wowData);
    });
  }, [number]);

  function orderAlphabeticallyByMovie(a, b) {
    if (a.movie < b.movie) {
      return -1;
    }
    if (a.movie > b.movie) {
      return 1;
    }
    return 0;
  }

  const handleSearchedMovie = (value) => {
    setSearchedMovie(value);
  };
  const handleSelecteddYear = (value) => {
    setSelectedYear(value);
  };

  const filteredMovies = wowData
    .filter((card) => {
      if (searchedMovie === '') {
        return true;
      } else {
        return card.movie
          .toLowerCase()
          .includes(searchedMovie.toLowerCase().trim());
      }
    })
    .filter((card) => {
      if (selectedYear === 'All') {
        return true;
      } else {
        return selectedYear.includes(card.year);
      }
    })
    .sort(orderAlphabeticallyByMovie);


  const getYears = () => {
    const movieYears = wowData.map((year) => year.year);
    const unrepeatedYear = movieYears.filter((year, index) => {
      return movieYears.indexOf(year) === index;
    });
    return unrepeatedYear;
  };

  // RUTES:
  const { pathname } = useLocation();
  //guardo toda la info de una ruta en la const dataPath y esa info me la da el método matchPath
  const dataPath = matchPath('/scene/:sceneId', pathname);
  console.log(dataPath);

  const sceneId = dataPath !== null ? dataPath.params.sceneId : null;

  const sceneFound = wowData.find((item) => item.uuid === sceneId);
  console.log(sceneFound);

  return (
    <div>
      < Header />
      <main>
        <Routes>
          {/* ruta estática */}
          <Route
            path="/"
            element={
              <>
                <Filters
                  handleSearchedMovie={handleSearchedMovie}
                  searchedMovie={searchedMovie}
                  handleSelecteddYear={handleSelecteddYear}
                  selectedYear={selectedYear}
                  years={getYears()}
                  number={number}
                  setNumber={setNumber}
                />
                <MovieSceneList filteredMovies={filteredMovies} />
              </>
            }
          />
          {/* ruta dinámica */}
          <Route
            path="/scene/:sceneId"
            element={<MovieSceneDetail scene={sceneFound} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
