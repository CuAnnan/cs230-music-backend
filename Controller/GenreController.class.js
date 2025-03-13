import Controller from './Controller.class.js';

class GenreController extends Controller
{
    async updateGenresForArtist(req, res)
    {
        let idArtist = req.body.idartist;
        let idGenresList = req.body.genres;
        console.log(idArtist);
        console.log(idGenresList);

        let questionMarks = [];
        let artistGenreQuestionMarks = [];
        let pairs = [];
        let idGenres = [];
        for(let i in idGenresList)
        {
            questionMarks.push("?");
            artistGenreQuestionMarks.push('(?,?)');
            pairs.push(idArtist);
            pairs.push(idGenresList[i].idGenre);
            idGenres.push(idGenresList[i].idGenre);
        }

        let questionMarkStrings = questionMarks.join(', ');
        let artistGenreString = artistGenreQuestionMarks.join(', ');

        let removeSQL = `DELETE FROM artists_genres WHERE idGenre NOT IN (${questionMarkStrings})`;
        let removeQry = await this.query(
            removeSQL,
            idGenres
        );
        console.log(removeQry.sql);
        let insertSQL = `INSERT IGNORE INTO artists_genres (idArtist, idGenre) VALUES ${artistGenreString}`;
        let insertQry = await this.query(
            insertSQL,
            pairs
        );
        console.log(insertQry.sql);
    }
}

export default GenreController;