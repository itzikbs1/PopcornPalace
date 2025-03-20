import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

import { Movie } from './movie';
import { UpdateMovie } from './update-movie';

@Injectable()
export class MovieService {
    private movies: Movie[];

    constructor() {
        this.movies = [];
    }

    addMovie(movie: Movie): Movie {
        this.movies.push(movie);
        return movie;
    }

    getAllMovies(): Movie[] {
        if (this.movies.length === 0) throw new NotFoundException('Their are no movies available');
        return this.movies;
    }

    getMovieByTitle(title: string): Movie | undefined {
        return this.movies.find(movie => movie.title === title);
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

    deleteMovie(title: string): Movie[] | null {
        const index = this.movies.findIndex(movie => movie.title === title);
        if (index !== -1) {
            const deletedMovie = this.movies.splice(index, 1);
            return deletedMovie;
        }
        throw new NotFoundException(`Movie ${title} Not Found For Deleting`)
        return null;
    }
}

// export default MovieService;