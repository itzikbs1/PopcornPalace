export class Movie {
    title: string;
    genre: string;
    duration: number;
    rating: number;
    release_year: number;

    constructor(
        title: string, 
        genre: string, 
        duration: number, 
        rating: number, 
        release_year: number
    ) {
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.rating = rating;
        this.release_year = release_year;
    }
}

// export default Movie;