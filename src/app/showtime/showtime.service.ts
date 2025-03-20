import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";

import { ShowTime } from "./showtime";
import { UpdateShowTime } from './update-showtime';

@Injectable()
export class ShowTimeService {
    private showtimes: ShowTime[];

    constructor() {
        this.showtimes = [];
    }

    addShowTime(showtime: ShowTime): ShowTime {
        
        if (showtime.startTime >= showtime.endTime) {
            throw new BadRequestException('Start time must be before end time.')
        }

        const newStartTime = showtime.startTime;
        const newEndTime = showtime.endTime;

        for (const existingShow of this.showtimes) {

            if (existingShow.theater === showtime.theater) {
                const existingStartTime = existingShow.startTime;
                const existingEndTime = existingShow.endTime;

                if (
                    (newStartTime <= existingStartTime && existingStartTime <= newEndTime) ||
                    (newStartTime <= existingEndTime && existingEndTime <= newEndTime) ||
                    (existingStartTime <= newStartTime && newEndTime <= existingEndTime)
                ) {
                    throw new ConflictException(`Showtime overlaps with existing showtime in theater ${existingShow.theater}`);
                }
            }
        }
        this.showtimes.push(showtime);
        return showtime;
    }

    // getAllShowTimes(): ShowTime[] {
    //     if (this.showtimes.length === 0) 
    //         throw new NotFoundException('There are no Showtimes Avalible at this time.')
        
    //     return this.showtimes;
    // }

    getShowTimeById(id: number): ShowTime | undefined {
        return this.showtimes.find(showtime => showtime.movieId === id);
    }

    updateShowTime(id: number, updatedShowTime: UpdateShowTime): ShowTime | null {
        const index = this.showtimes.findIndex(showtime => showtime.movieId === id);
        if (index !== -1) {
            this.showtimes[index] = { ...this.showtimes[index], ...updatedShowTime}
            return this.showtimes[index];
        }
        throw new NotFoundException('This ShowTime Dosent Found');
    }
    
    deleteShowTime(id: number): ShowTime[] | null {
        const index = this.showtimes.findIndex(showtime => showtime.movieId === id);
        if (index !== -1) {
            const deletedShowTime = this.showtimes.splice(index, 1);
            return deletedShowTime
        }
        throw new NotFoundException('This ShowTime Not Found For Deleting');
    }

}