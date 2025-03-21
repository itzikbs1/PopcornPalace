import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { Movie } from './movie';
import { UpdateMovie } from './update-movie';

@Injectable()
export class MovieService {
    private movies: Movie[] = [
        { id: 1, title: "Inception", genre: "Sci-Fi", duration: 148, rating: 8.8, release_year: 2010 },
        { id: 2, title: "The Dark Knight", genre: "Action", duration: 152, rating: 9.0, release_year: 2008 },
        { id: 3, title: "Interstellar", genre: "Sci-Fi", duration: 169, rating: 8.6, release_year: 2014 },
    ];

    private idCounter = 4;
    // constructor() {
    //     this.movies = [];
    // }

    addMovie(movie: Omit<Movie, 'id'>): Movie {
        const existingMovie = this.movies.find(m => m.title === movie.title && m.release_year === movie.release_year);
        if (existingMovie) {
            throw new BadRequestException(`Movie "${movie.title}" from ${movie.release_year} already exists.`);
        }
        const newMovie: Movie = { id: this.idCounter++, ...movie };
        this.movies.push(newMovie);
        return newMovie;
    }

    getAllMovies(): Movie[] {
        if (this.movies.length === 0) throw new NotFoundException('Their are no movies available');
        return this.movies;
    }

    getMovieByTitle(title: string): Movie | undefined {
        return this.movies.find(movie => movie.title === title);
    }
    
    getMovieById(id: number): Movie | undefined {
        return this.movies.find(movie => movie.id === id);
    }

    updateMovie(title: string, updatedMovie: UpdateMovie): Movie | null {
        const index = this.movies.findIndex(movie => movie.title === title);
        if (index !== -1) {
            this.movies[index] = { ...this.movies[index], ...updatedMovie };
            return this.movies[index];
        }
        throw new NotFoundException(`Movie ${title} Not Found`)
        return null;
    }

    deleteMovie(title: string)  {
        const index = this.movies.findIndex(movie => movie.title === title);
        if (index === -1) {
            throw new NotFoundException(`Movie ${title} Not Found For Deleting`)
        }
        this.movies.splice(index, 1);
    }
}