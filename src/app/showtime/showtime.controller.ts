import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, ParseIntPipe, HttpCode } from '@nestjs/common';

import { ShowTimeService } from "./showtime.service";
import { Prisma } from '@prisma/client';

@Controller('showtimes')
export class ShowTimeController {

    constructor(private readonly showTimeService: ShowTimeService) {}

    @Get('/all')
    async getAllShowTimes() {
        return this.showTimeService.getAllShowTimes();
    }
    @Get(':id')
    async getShowTimeById(@Param('id', ParseIntPipe) id: number) {
        return this.showTimeService.getShowTimeById(id);
    }

    @Post()
    @HttpCode(200)
    async create(@Body(ValidationPipe) showTime: Omit<Prisma.ShowtimeCreateInput, 'movie'> & { movieId: number }) {
        return this.showTimeService.addShowTime(showTime);
    }

    @Post('/update/:id')
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) showTimeUpdate: Omit<Prisma.ShowtimeUpdateInput, 'movie'> & { movieId: number }) {
        return this.showTimeService.updateShowTime(id, showTimeUpdate);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.showTimeService.deleteShowTime(id);
        // return { message: 'Showtime deleted successfully' };
    }
}