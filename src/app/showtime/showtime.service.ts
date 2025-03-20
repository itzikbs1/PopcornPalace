import { Injectable } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";

import { ShowTime } from "./showtime";
import { UpdateShowTime } from './update-showtime';

@Injectable()
export class ShowTimeService {
    private showtimes: ShowTime[];

    constructor() {
        this.showtimes = [];
    }

    addShowTime(showtime: ShowTime): ShowTime {
        this.showtimes.push(showtime);
        return showtime;
    }

    // getAllShowTimes(): ShowTime[] {
    //     if (this.showtimes.length === 0) 
    //         throw new NotFoundException('There are no Showtimes Avalible at this time.')
        
    //     return this.showtimes;
    // }

    getShowTimeById(id: number): ShowTime | undefined {
        return this.showtimes.find(showtime => showtime.id === id);
    }

    updateShowTime(id: number, updatedShowTime: UpdateShowTime): ShowTime | null {
        const index = this.showtimes.findIndex(showtime => showtime.id === id);
        if (index !== -1) {
            this.showtimes[index] = { ...this.showtimes[index], ...updatedShowTime}
            return this.showtimes[index];
        }
        throw new NotFoundException('This ShowTime Dosent Found');
    }
    
    deleteShowTime(id: number): ShowTime[] | null {
        const index = this.showtimes.findIndex(showtime => showtime.id === id);
        if (index !== -1) {
            const deletedShowTime = this.showtimes.splice(index, 1);
            return deletedShowTime
        }
        throw new NotFoundException('This ShowTime Not Found For Deleting');
    }

}