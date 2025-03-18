import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

import { MovieService } from './movie.service';
import { Movie } from './movie';

@Controller('movies')
export class MovieController {
    // private movieService: MovieService;

    // constructor() {
    //     this.movieService = new MovieService();
    // }
    constructor(private readonly movieService: MovieService) {}

    @Get('/all') // GET movies/all
    getAllMovies(): Movie[] {
        return this.movieService.getAllMovies();
    }

    @Post()
    addMovie(@Body() movie: Movie): Movie {
        return this.movieService.addMovie(movie);
    }


    @Get(':title') // GET movies/:title
    getMovieByTitle(@Param('title') title: string): Movie | undefined {
        return this.movieService.getMovieByTitle(title);
    }

    @Post('/update/:title')
    updateMovie(@Param('title') title: string, @Body() updatedMovie: Partial<Movie>): Movie | null {
        return this.movieService.updateMovie(title, updatedMovie);
    }

    @Delete(':title')
    deleteMovie(@Param('title') title: string): Movie[] | null {
        return this.movieService.deleteMovie(title);
    }
}

// export default MovieController;