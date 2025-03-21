import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";

import { ShowTime } from "./showtime";
import { UpdateShowTime } from './update-showtime';
import { MovieService } from "../movie/movie.service"; 

@Injectable()
export class ShowTimeService {
    private showtimes: ShowTime[] = [
        { id: 1, movieId: 1, theater: "Cinema City", startTime: new Date("2025-03-21T16:05:00Z"), endTime: new Date("2025-04-10T20:30:00Z"), price: 50.0, bookings: [] },
        { id: 2, movieId: 2, theater: "IMAX", startTime: new Date("2025-03-20T18:00:00Z"), endTime: new Date("2025-04-11T22:45:00Z"), price: 70.0, bookings: [] },
        { id: 3, movieId: 3, theater: "Downtown Theater", startTime: new Date("2025-04-12T17:30:00Z"), endTime: new Date("2025-04-12T19:45:00Z"), price: 45.0, bookings: [] }
    ];
    
    private idCounter = 4; // Start ID from 4 since 1-3 are predefined

    // constructor() {
    //     this.showtimes = [];
    // }
    constructor(private readonly movieService: MovieService) {}

    getShowTimeById(id: number): ShowTime {
        const showtime = this.showtimes.find(showtime => showtime.id === id);
        if (!showtime) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }
        return showtime;
    }

    addShowTime(showtimeData: Omit<ShowTime, 'id'>): ShowTime { //Omit<ShowTime, id> Create a new type that removes `id`
        if (!showtimeData.movieId || !showtimeData.price || !showtimeData.theater || !showtimeData.startTime || !showtimeData.endTime) {
            throw new BadRequestException('Missing required showtime fields');
        }

        // Check if movie exists
        try {
            // You need to add a method to MovieService to get movie by ID
            const movie = this.movieService.getMovieById(showtimeData.movieId);
            if (!movie) {
                throw new NotFoundException(`Movie with ID ${showtimeData.movieId} not found`);
            }
        } catch (error) {
            throw new NotFoundException(`Movie with ID ${showtimeData.movieId} not found`);
        }

        const newStartTime = new Date(showtimeData.startTime);
        const newEndTime = new Date(showtimeData.endTime);

        if (newStartTime >= newEndTime) {
            throw new BadRequestException('Start time must be before end time.')
        }

        for (const existingShow of this.showtimes) {

            if (existingShow.theater === showtimeData.theater) {
                const existingStartTime = new Date(existingShow.startTime);
                const existingEndTime = new Date(existingShow.endTime);

                if (
                    (newStartTime <= existingStartTime && existingStartTime < newEndTime) ||
                    (newStartTime < existingEndTime && existingEndTime <= newEndTime) ||
                    (existingStartTime <= newStartTime && newEndTime <= existingEndTime)
                ) {
                    throw new ConflictException(`Showtime overlaps with existing showtime in theater ${existingShow.theater}`);
                }
            }
        }
        const newShowtime: ShowTime = { id: this.idCounter++, ...showtimeData, bookings: [] };
        this.showtimes.push(newShowtime);
        return newShowtime;
    }

    // getAllShowTimes(): ShowTime[] {
    //     if (this.showtimes.length === 0) 
    //         throw new NotFoundException('There are no Showtimes Avalible at this time.')
        
    //     return this.showtimes;
    // }




    updateShowTime(id: number, updatedData: Partial<Omit<ShowTime, 'id'>>): ShowTime {
        const showtimeIndex = this.showtimes.findIndex(showtime => showtime.id === id);
        if (showtimeIndex === -1) {
            throw new NotFoundException(`Showtime with ID ${id} not found`);
        }

        // Check if movie exists
        try {
            // You need to add a method to MovieService to get movie by ID
            const movie = this.movieService.getMovieById(updatedData.movieId);
            if (!movie) {
                throw new NotFoundException(`Movie with ID ${updatedData.movieId} not found`);
            }
        } catch (error) {
            throw new NotFoundException(`Movie with ID ${updatedData.movieId} not found`);
        }

        const existingShowtime = this.showtimes[showtimeIndex];

        // Check if the user is modifying the theater, startTime, or endTime
        const newTheater = updatedData.theater ?? existingShowtime.theater;
        const newStartTime = updatedData.startTime ?? existingShowtime.startTime;
        const newEndTime = updatedData.endTime ?? existingShowtime.endTime;

        if (newStartTime >= newEndTime) {
            throw new BadRequestException('Start time must be before end time.');
        }

        // Check for overlapping showtimes in the same theater
        for (const otherShow of this.showtimes) {
            if (otherShow.id !== id && otherShow.theater === newTheater) {
                const existingStartTime = otherShow.startTime;
                const existingEndTime = otherShow.endTime;

                if (
                    (newStartTime <= existingStartTime && existingStartTime < newEndTime) ||
                    (newStartTime < existingEndTime && existingEndTime <= newEndTime) ||
                    (existingStartTime <= newStartTime && newEndTime <= existingEndTime)
                ) {
                    throw new ConflictException(`Updated showtime overlaps with an existing showtime in theater ${newTheater}`);
                }
            }
        }

        // Update the showtime
        this.showtimes[showtimeIndex] = { ...existingShowtime, ...updatedData };
        return this.showtimes[showtimeIndex];
    }
    
    deleteShowTime(id: number) {
        const index = this.showtimes.findIndex(showtime => showtime.id === id);
        if (index === -1) {
            throw new NotFoundException('This ShowTime Not Found For Deleting');
        }
        this.showtimes.splice(index, 1);        
    }

}