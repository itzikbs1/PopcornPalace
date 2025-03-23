import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';


@Injectable()
export class MovieService {

    constructor(private readonly database: DatabaseService) {}

    async getAllMovies() {
        const movies = await this.database.movie.findMany();

        if (movies.length === 0) {
            throw new NotFoundException('There are no movies available');
        }

        return movies;
    }

    async addMovie(movie: Prisma.MovieCreateInput) {
        if (!movie.title || movie.title.trim() === '') {
            throw new BadRequestException('Title is required');
        }
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

    async updateMovie(title: string, movieUpdate: Prisma.MovieUpdateInput) {
        if (!title.trim()) {
            throw new BadRequestException('Title cannot be empty');
        }

        const existingMovie = await this.database.movie.findUnique({ where: { title } });
        if (!existingMovie) {
            throw new NotFoundException(`Movie with title "${title}" not found`);
        }

        try {
            return await this.database.movie.update({
                where: { title },
                data: movieUpdate,
            });
        } catch (error) {
            throw new BadRequestException('Error updating movie: ' + error.message);
        }
    }

    async deleteMovie(title: string) {
        if (!title.trim()) {
            throw new BadRequestException('Title cannot be empty');
        }

        const existingMovie = await this.database.movie.findUnique({ where: { title } });
        if (!existingMovie) {
            throw new NotFoundException(`Movie with title "${title}" not found`);
        }

        try {
            return await this.database.movie.delete({ where: { title } });
        } catch (error) {
            throw new BadRequestException('Error deleting movie: ' + error.message);
        }
    }
}