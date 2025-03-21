import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';

import { ShowTimeService } from "./showtime.service";
import { ShowTime } from "./showtime";
import { UpdateShowTime } from './update-showtime';

@Controller('showtimes')
export class ShowTimeController {

    constructor(private readonly showTimeService: ShowTimeService) {}

    @Get(':id')
    getShowTimeById(@Param('id', ParseIntPipe) id: number): ShowTime {
        return this.showTimeService.getShowTimeById(id);
    }

    @Post()
    create(@Body(ValidationPipe) showTime: Omit<ShowTime, 'id'>): ShowTime {
        return this.showTimeService.addShowTime(showTime);
    }

    @Post('/update/:id')
    update(@Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatedData: Partial<Omit<ShowTime, 'id'>>): ShowTime | null {
        return this.showTimeService.updateShowTime(id, updatedData);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): { message: string } {
        this.showTimeService.deleteShowTime(id);
        return { message: 'Showtime deleted successfully' };
    }
}