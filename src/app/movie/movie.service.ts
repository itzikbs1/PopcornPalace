import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { validateSync } from 'class-validator';

import { DatabaseService } from '../../database/database.service';
import { CreateMovieDto } from './movie';
import { UpdateMovieDto } from './update-movie.dto';

@Injectable()
export class MovieService {

    constructor(private readonly database: DatabaseService) {}

    async getAllMovies() {
        const movies = await this.database.movie.findMany();
        return movies;
    }

    async addMovie(movie: CreateMovieDto) {
        const errors = validateSync(Object.assign(new CreateMovieDto(), movie));

        if (errors.length > 0) {
            throw new BadRequestException(errors.map(err => Object.values(err.constraints)).join(', '));
        }
        // if (!movie.title) {
        //     throw BadRequestException('Title is Requied')
        // }
        const existingMovie = await this.database.movie.findUnique({
            where: { title: movie.title },
        });
    
        if (existingMovie) {
            throw new BadRequestException(`A movie with the title "${movie.title}" already exists. Please choose a different title.`);
        }
        // return await this.database.movie.create({ data: movie });
        
        try {
            return await this.database.movie.create({ data: movie });
        } catch (error) {
            throw new BadRequestException('Error creating movie: ' + error.message);
        }
    }
    

    async getMovieByTitle(title: string) {
        if (!title.trim()) {
            throw new BadRequestException('Title cannot be empty');
        }

        const movie = await this.database.movie.findUnique({ where: { title } });
        if (!movie) {
            throw new NotFoundException(`Movie with title "${title}" not found`);
        }
        return movie;
    }
    
    async getMovieById(id: number) {
        if (!id) {
            throw new BadRequestException('Movie ID is required');
        }

        const movie = await this.database.movie.findUnique({ where: { id } });
        if (!movie) {
            throw new NotFoundException(`Movie with ID ${id} not found`);
        }
        return movie;
    }

    async updateMovie(title: string, movieUpdate: UpdateMovieDto) {
        if (!title.trim()) {
            throw new BadRequestException('Title cannot be empty');
        }

        const existingMovie = await this.database.movie.findUnique({ where: { title } });
        if (!existingMovie) {
            throw new BadRequestException(`Movie with title "${title}" not found`);
        }

        await this.database.movie.update({
            where: { title },
            data: movieUpdate,
        });
    }

    async deleteMovie(title: string) {
        if (!title.trim()) {
            throw new BadRequestException('Title cannot be empty');
        }

        const existingMovie = await this.database.movie.findUnique({ where: { title } });
        if (!existingMovie) {
            throw new BadRequestException(`Movie with title "${title}" not found`);
        }

        try {
            await this.database.movie.delete({ where: { title } });
        } catch (error) {
            throw new BadRequestException('Error deleting movie: ' + error.message);
        }
    }
}