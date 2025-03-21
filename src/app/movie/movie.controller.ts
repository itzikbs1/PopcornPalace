import { Controller, Get, Post, Body, Param, Delete, ValidationPipe } from '@nestjs/common';

import { MovieService } from './movie.service';
import { Movie } from './movie';
import { UpdateMovie } from './update-movie';

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
    create(@Body(ValidationPipe) movie: Omit<Movie, 'id'>): Movie {
        return this.movieService.addMovie(movie);
    }


    @Get(':title') // GET movies/:title
    getMovieByTitle(@Param('title') title: string): Movie | undefined {
        return this.movieService.getMovieByTitle(title);
    }

    @Post('/update/:title')
    update(@Param('title') title: string, @Body(ValidationPipe) movieUpdate: UpdateMovie): Movie | null {
        return this.movieService.updateMovie(title, movieUpdate);
    }

    @Delete(':title')
    deleteMovie(@Param('title') title: string) {
        return this.movieService.deleteMovie(title);
    }
}