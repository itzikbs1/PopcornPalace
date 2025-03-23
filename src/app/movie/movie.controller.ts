import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, HttpCode } from '@nestjs/common';

import { MovieService } from './movie.service';
import { Prisma } from '@prisma/client';

@Controller('movies')
export class MovieController {
    
    constructor(private readonly movieService: MovieService) {}

    @Get('/all') // GET movies/all
    async getAllMovies() {
        return this.movieService.getAllMovies();
    }

    @Post()
    @HttpCode(200)
    // create(@Body(ValidationPipe) movie: Omit<Movie, 'id'>): Movie {
    async create(@Body(ValidationPipe) movie: Prisma.MovieCreateInput) {
        return this.movieService.addMovie(movie);
    }


    @Get(':title') // GET movies/:title
    async getMovieByTitle(@Param('title') title: string) {
        return this.movieService.getMovieByTitle(title);
    }

    @Post('/update/:title')
    @HttpCode(200)
    async update(@Param('title') title: string, @Body(ValidationPipe) movieUpdate: Prisma.MovieUpdateInput) {
        return this.movieService.updateMovie(title, movieUpdate);
    }

    @Delete(':title')
    async deleteMovie(@Param('title') title: string) {
        return this.movieService.deleteMovie(title);
    }
}