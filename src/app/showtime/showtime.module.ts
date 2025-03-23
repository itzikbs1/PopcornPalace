import { Module } from "@nestjs/common";

import { ShowTimeController } from "./showtime.controller";
import { ShowTimeService } from "./showtime.service";
import { MovieModule } from "../movie/movie.module";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [MovieModule, DatabaseModule],
    controllers: [ShowTimeController],
    providers: [ShowTimeService],
    exports: [ShowTimeService]
})

export class ShowTimeModule {}