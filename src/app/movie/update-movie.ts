import { PartialType } from '@nestjs/mapped-types';

import { Movie } from "./movie";

export class UpdateMovie extends PartialType(Movie) {}