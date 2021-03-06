import { useState } from 'react';
import { ReactNode } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import {createContext} from 'react'
import { api } from '../services/api';

interface GenreResponseProps {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
  }
  
  interface MovieProps {
    imdbID: string;
    Title: string;
    Poster: string;
    Ratings: Array<{
      Source: string;
      Value: string;
    }>;
    Runtime: string;
  }



interface MovieContextProviderProps{
 children: ReactNode
}

interface MovieContextProps {
  genres:Array<GenreResponseProps>,
  handleClickButton: (id: number) => void,
  movies: Array<MovieProps>,
  selectedGenreId: number,
  selectedGenre: GenreResponseProps
}

export const  MovieContext = createContext<MovieContextProps>({})


export function MovieContextProvider({children}:MovieContextProviderProps){
    const [selectedGenreId, setSelectedGenreId] = useState(1);
    const [genres, setGenres] = useState<GenreResponseProps[]>([]);
    
    const [movies, setMovies] = useState<MovieProps[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

    useEffect(() => {
      api.get<GenreResponseProps[]>('genres').then(response => {
        setGenres(response.data);
      });
    }, []);
  
    useEffect(() => {
      api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
        setMovies(response.data);
        
      });
  
      api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
        setSelectedGenre(response.data);
      })
    }, [selectedGenreId]);

    const  handleClickButton = useCallback((id: number) => {
      setSelectedGenreId(id);
    },[])

   return(
    <MovieContext.Provider value={{genres, movies, selectedGenreId, selectedGenre, handleClickButton}}>
    {children}
    </MovieContext.Provider>
   )
}
