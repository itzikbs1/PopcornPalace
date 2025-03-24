import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, HttpCode, UsePipes } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './movie'; //from './create-movie.dto';

@Controller('movies')
export class MovieController {
    
    constructor(private readonly movieService: MovieService) {}

    @Get('/all') // GET movies/all
    async getAllMovies() {
        return this.movieService.getAllMovies();
    }

    @Post()
    @HttpCode(200)
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    createMovie(@Body() createMovieDto: CreateMovieDto) {
        return this.movieService.addMovie(createMovieDto);
    }


    @Get(':title') // GET movies/:title
    async getMovieByTitle(@Param('title') title: string) {
        return this.movieService.getMovieByTitle(title);
    }

    @Post('/update/:title')
    @HttpCode(200)
    async update(@Param('title') title: string, @Body(ValidationPipe) movieUpdate: Prisma.MovieUpdateInput) {
        await this.movieService.updateMovie(title, movieUpdate);
    }

    @Delete(':title')
    async deleteMovie(@Param('title') title: string) {
        await this.movieService.deleteMovie(title);
    }
}