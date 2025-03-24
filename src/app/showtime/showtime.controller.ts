import { Controller, Get, Post, Body, Param, Delete, ValidationPipe, ParseIntPipe, HttpCode } from '@nestjs/common';

import { ShowTimeService } from "./showtime.service";
import { CreateShowtimeDto } from './create-showtime.dto';
import { UpdateShowtimeDto } from './update-showtime.dto';

@Controller('showtimes')
export class ShowTimeController {

    constructor(private readonly showTimeService: ShowTimeService) {}

    @Get('/all')
    async getAllShowTimes() {
        return this.showTimeService.getAllShowTimes();
    }
    @Get(':id')
    @HttpCode(200)
    async getShowTimeById(@Param('id', ParseIntPipe) id: number) {
        return this.showTimeService.getShowTimeById(id);
    }

    @Post()
    @HttpCode(200)
    async create(@Body(ValidationPipe) createShowtimeDto: CreateShowtimeDto) {
        return this.showTimeService.addShowTime(createShowtimeDto);
    }

    @Post('/update/:id')
    @HttpCode(200)
    async update(@Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateShowtimeDto: UpdateShowtimeDto) {
        await this.showTimeService.updateShowTime(id, updateShowtimeDto);
    }

    @Delete(':id')
    @HttpCode(200)
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.showTimeService.deleteShowTime(id);
    }
}