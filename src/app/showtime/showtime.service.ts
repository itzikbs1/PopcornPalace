import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";

// import { ShowTime } from "./showtime";
// import { UpdateShowTime } from './update-showtime';
// import { MovieService } from "../movie/movie.service";
import { Prisma } from "@prisma/client"; 

import { DatabaseService } from "../../database/database.service";
import { CreateShowtimeDto } from "./create-showtime.dto";
import { UpdateShowtimeDto } from "./update-showtime.dto";

@Injectable()
export class ShowTimeService {

    constructor(private readonly database: DatabaseService) {}

    async getAllShowTimes() {
        const showtimes = await this.database.showtime.findMany();
        if (showtimes.length === 0) {
            throw new BadRequestException("There are no showtimes available");
        }
        return showtimes;
    }

    async getShowTimeById(id: number) {
        if (!id) {
            throw new BadRequestException("Showtime ID is required");
        }
        const showtime = await this.database.showtime.findUnique({ where: { id } }) /// (showtime => showtime.id === id);
        if (!showtime) {
            throw new BadRequestException(`Showtime with ID ${id} not found`);
        }
        return showtime;
    }

    async addShowTime(showtimeData: CreateShowtimeDto) { //Omit<ShowTime, id> Create a new type that removes `id`
        if (!showtimeData.movieId || !showtimeData.price || !showtimeData.theater || !showtimeData.startTime || !showtimeData.endTime) {
            throw new BadRequestException('Missing required showtime fields');
        }

        const movieExists = await this.database.movie.findUnique({ where: { id: showtimeData.movieId } });
        if (!movieExists) {
            throw new BadRequestException(`Movie with ID ${showtimeData.movieId} not found`);
        }

        const newStartTime = new Date(showtimeData.startTime);
        const newEndTime = new Date(showtimeData.endTime);

        if (newStartTime >= newEndTime) {
            throw new BadRequestException('Start time must be before end time.');
        }
        // Check for overlapping showtimes in the same theater
        const overlappingShowtime = await this.database.showtime.findFirst({
            where: {
                theater: showtimeData.theater,
                OR: [
                    {
                        startTime: { lte: newStartTime },
                        endTime: { gt: newStartTime }
                    },
                    {
                        startTime: { lt: newEndTime },
                        endTime: { gte: newEndTime }
                    },
                    {
                        startTime: { gte: newStartTime },
                        endTime: { lte: newEndTime }
                    }
                ]
            }
        });

        if (overlappingShowtime) {
            throw new ConflictException(`Showtime overlaps with an existing showtime in theater ${showtimeData.theater}`);
        }

        try {
            return await this.database.showtime.create({ 
                data: { 
                    movie: { connect: { id: showtimeData.movieId } },
                    theater: showtimeData.theater,
                    startTime: showtimeData.startTime,
                    endTime: showtimeData.endTime,
                    price: showtimeData.price
                } 
            });
        } catch (error) {
            throw new ConflictException("Error creating showtime: " + error.message);
        }
    }

    async updateShowTime(id: number, updateData: UpdateShowtimeDto) {
        const existingShowTime = await this.database.showtime.findUnique({ where: { id } });
        if (!existingShowTime) {
            throw new BadRequestException(`Showtime with ID ${id} not found`);
        }
        if (updateData.movieId) {
            const movieExists = await this.database.movie.findUnique({ where: { id: updateData.movieId }});
            if (!movieExists) {
                throw new BadRequestException(`Movie with ID ${updateData.movieId} not found. Unable to update.`);
            }
        }

        const newStartTime = updateData.startTime instanceof Date ? updateData.startTime : new Date(existingShowTime.startTime);
        const newEndTime = updateData.endTime instanceof Date ? updateData.endTime : new Date(existingShowTime.endTime);

        if (newStartTime >= newEndTime) {
            throw new BadRequestException('Start time must be before end time.');
        }

        const overlappingShowtime = await this.database.showtime.findFirst({
            where: {
                theater: existingShowTime.theater,
                id: { not: id }, // Exclude the current showtime
                OR: [
                    { startTime: { lte: newStartTime }, endTime: { gt: newStartTime } },
                    { startTime: { lt: newEndTime }, endTime: { gte: newEndTime } },
                    { startTime: { gte: newStartTime }, endTime: { lte: newEndTime } }
                ]
            }
        });

        if (overlappingShowtime) {
            throw new ConflictException(`Updated showtime overlaps with an existing showtime in theater ${existingShowTime.theater}`);
        }

        try {
            await this.database.showtime.update({
                where: { id },
                data: updateData,
            });
        } catch (error) {
            throw new BadRequestException("Error updating showtime: " + error.message);
        }
    }
    
    async deleteShowTime(id: number) {
        const existingShowTime = await this.database.showtime.findUnique({ where: { id } });
        if (!existingShowTime) {
            throw new BadRequestException(`Showtime with ID ${id} not found`);
        }

        try {
            await this.database.showtime.delete({ where: { id } });
        } catch (error) {
            throw new BadRequestException("Error deleting showtime: " + error.message);
        }
    }

}