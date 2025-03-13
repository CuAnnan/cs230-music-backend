import Controller from './Controller.class.js';

class GenreController extends Controller
{
    async addExistingGenresToArtist(idArtist, idGenres)
    {
        let pairs = [];
        for(let idGenre of idGenres)
        {
            pairs.push(idArtist);
            pairs.push(idGenre);
        }
        return this.query(
            `INSERT IGNORE INTO artists_genres (idArtist, idGenre) VALUES ${Array(idGenres.length).fill('(?,?)').join(',')}`,
            pairs
        );
    }

    async addNewGenres(idArtist, genreNames)
    {
        const holder = Array(genreNames.length).fill('(?)').join(',');
        await this.query(
            `INSERT IGNORE INTO genres (name) VALUES ${holder}`,
            genreNames
        );

        let fetchQry = await this.query(
            `SELECT * FROM genres WHERE name in (${holder})`,
            genreNames
        );
        let newIds = [];
        for(let result of fetchQry)
        {
            newIds.push(result.idgenre);
        }
        return newIds;

    }

    async updateGenresForArtist(req, res)
    {
        let idArtist = req.body.idartist;
        let idGenresList = req.body.genres;
        let pendingGenresList = req.body.pendingGenres;

        let idGenres = [];
        for(let i in idGenresList)
        {
            idGenres.push(idGenresList[i].idGenre);
        }

        await this.query(
            `DELETE FROM artists_genres WHERE idGenre NOT IN (${ Array(idGenres.length).fill('?').join(',')})`,
            idGenres
        );

        if(pendingGenresList)
        {
            let genreToIds = {};
            let existingGenreQuestionMarks = [];
            let genreNames = [];

            for(let pendingGenre of pendingGenresList)
            {
                genreToIds[pendingGenre.name.toLowerCase()] = -1;
                existingGenreQuestionMarks.push('?');
                genreNames.push(pendingGenre.name);
            }
            let existingGenres = await this.query(
                `SELECT * FROM genres WHERE name IN(${existingGenreQuestionMarks.join(',')})`,
                genreNames
            );

            let existingGenreIds = [];
            for(let existingGenre of existingGenres)
            {
                delete(genreToIds[existingGenre.name.toLowerCase()]);
                existingGenreIds.push(existingGenre.idgenre);
            }

            await this.addExistingGenresToArtist(idArtist, existingGenreIds);

            let newIds = await this.addNewGenres(idArtist, Object.keys(genreToIds));
            idGenres = [...idGenres, ...Object.keys(genreToIds), ...newIds];
        }

        await this.addExistingGenresToArtist(idArtist, idGenres);

    }
}

export default GenreController;