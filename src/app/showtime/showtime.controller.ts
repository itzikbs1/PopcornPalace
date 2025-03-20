import { Controller, Get, Post, Body, Param, Delete, ValidationPipe } from '@nestjs/common';

import { ShowTimeService } from "./showtime.service";
import { ShowTime } from "./showtime";
import { UpdateShowTime } from './update-showtime';

@Controller('showtimes')
export class ShowTimeController {

    constructor(private readonly showTimeService: ShowTimeService) {}

    @Get(':id')
    getShowTimeById(@Param('id') id: string): ShowTime {
        return this.showTimeService.getShowTimeById(+id);
    }

    @Post()
    create(@Body(ValidationPipe) showTime: ShowTime): ShowTime {
        return this.showTimeService.addShowTime(showTime);
    }

    @Post('/update/:id')
    update(@Param('id') id: string, @Body(ValidationPipe) showTimeUpdate: UpdateShowTime): ShowTime | null {
        return this.showTimeService.updateShowTime(+id, showTimeUpdate);
    }

    @Delete(':id')
    delete(@Param('id') id: string): ShowTime[] | null {
        return this.showTimeService.deleteShowTime(+id);
    }
}