import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";

// import { ShowTime } from "./showtime";
// import { UpdateShowTime } from './update-showtime';
// import { MovieService } from "../movie/movie.service";
import { Prisma } from "@prisma/client"; 

import { DatabaseService } from "src/database/database.service";

@Injectable()
export class ShowTimeService {
    // private showtimes: ShowTime[] = [
    //     { id: 1, movieId: 1, theater: "Cinema City", startTime: new Date("2025-03-21T16:05:00Z"), endTime: new Date("2025-04-10T20:30:00Z"), price: 50.0, bookings: [] },
    //     { id: 2, movieId: 2, theater: "IMAX", startTime: new Date("2025-03-20T18:00:00Z"), endTime: new Date("2025-04-11T22:45:00Z"), price: 70.0, bookings: [] },
    //     { id: 3, movieId: 3, theater: "Downtown Theater", startTime: new Date("2025-04-12T17:30:00Z"), endTime: new Date("2025-04-12T19:45:00Z"), price: 45.0, bookings: [] }
    // ];
    
    // private idCounter = 4; // Start ID from 4 since 1-3 are predefined

    // constructor() {
    //     this.showtimes = [];
    // }
    constructor(private readonly database: DatabaseService) {}

    async getAllShowTimes() {
        const showtimes = await this.database.showtime.findMany();
        if (showtimes.length === 0) {
            throw new NotFoundException("There are no showtimes available");
        }
        return showtimes;
    }

    async getShowTimeById(id: number) {
        if (!id) {
            throw new BadRequestException("Showtime ID is required");
        }
        const showtime = await this.database.showtime.findUnique({ where: { id } }) /// (showtime => showtime.id === id);
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }
        return showtime;
    }

    async addShowTime(showtimeData: Omit<Prisma.ShowtimeCreateInput, 'movie'> & { movieId: number }) { //Omit<ShowTime, id> Create a new type that removes `id`
        if (!showtimeData.movieId || !showtimeData.theater || !showtimeData.startTime || !showtimeData.endTime) {
            throw new BadRequestException('Missing required showtime fields');
        }

        const movieExists = await this.database.movie.findUnique({ where: { id: showtimeData.movieId } });
        if (!movieExists) {
            throw new NotFoundException(`Movie with ID ${showtimeData.movieId} not found`);
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
                    movie: { connect: { id: showtimeData.movieId } }, // Correctly link movie
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

    // getAllShowTimes(): ShowTime[] {
    //     if (this.showtimes.length === 0) 
    //         throw new NotFoundException('There are no Showtimes Avalible at this time.')
        
    //     return this.showtimes;
    // }




    async updateShowTime(id: number, showTimeUpdate: Omit<Prisma.ShowtimeUpdateInput, 'movie'> & { movieId?: number }) {
        const existingShowTime = await this.database.showtime.findUnique({ where: { id } });
        if (!existingShowTime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }
        if (showTimeUpdate.movieId) {
            const movieExists = await this.database.movie.findUnique({ where: { id: showTimeUpdate.movieId }});
            if (!movieExists) {
                throw new NotFoundException(`Movie with ID ${showTimeUpdate.movieId} not found`);
            }
        }

        const newStartTime = showTimeUpdate.startTime ? new Date(showTimeUpdate.startTime as string) : new Date(existingShowTime.startTime);
        const newEndTime = showTimeUpdate.endTime ? new Date(showTimeUpdate.endTime as string) : new Date(existingShowTime.endTime);

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
            return await this.database.showtime.update({
                where: { id },
                data: showTimeUpdate,
            });
        } catch (error) {
            throw new BadRequestException("Error updating showtime: " + error.message);
        }
    }
    
    async deleteShowTime(id: number) {
        const existingShowTime = await this.database.showtime.findUnique({ where: { id } });
        if (!existingShowTime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }

        try {
            return await this.database.showtime.delete({ where: { id } });
        } catch (error) {
            throw new BadRequestException("Error deleting showtime: " + error.message);
        }
    }

}