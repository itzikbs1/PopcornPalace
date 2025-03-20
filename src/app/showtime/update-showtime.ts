import { PartialType } from '@nestjs/mapped-types';

import { ShowTime } from "./showtime";

export class UpdateShowTime extends PartialType(ShowTime) {}