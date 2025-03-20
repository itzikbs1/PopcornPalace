import { Module } from "@nestjs/common";

import { ShowTimeController } from "./showtime.controller";
import { ShowTimeService } from "./showtime.service";

@Module({
    imports: [],
    controllers: [ShowTimeController],
    providers: [ShowTimeService],
})

export class ShowTimeModule {}