import Controller from './Controller.class.js';

class GenreController extends Controller
{
    static instance;

    async getGenresByIdArtist(idArtist)
    {
        return (await this.query(
            "SELECT g.name, g.idGenre " +
            "FROM artists_genres ag " +
            "LEFT JOIN genres g USING (idGenre) " +
            "WHERE ag.idArtist = ?",
            [idArtist]
        )).results;
    }

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

        let fetchQry = (await this.query(
            `SELECT * FROM genres WHERE name in (${holder})`,
            genreNames
        )).results;
        let newIds = [];
        for(let result of fetchQry)
        {
            newIds.push(result.idgenre);
        }
        return newIds;

    }

    async getGenreIdsToAddToAuthor(idArtist, idGenres)
    {
        let genreToIds = {};
        let existingGenreQuestionMarks = [];
        let genreNames = [];

        for(let pendingGenre of idGenres)
        {
            genreToIds[pendingGenre.name.toLowerCase()] = -1;
            existingGenreQuestionMarks.push('?');
            genreNames.push(pendingGenre.name);
        }
        let existingGenres = (await this.query(
            `SELECT * FROM genres WHERE name IN(${existingGenreQuestionMarks.join(',')})`,
            genreNames
        )).results;

        let existingGenreIds = [];
        for(let existingGenre of existingGenres)
        {
            delete(genreToIds[existingGenre.name.toLowerCase()]);
            existingGenreIds.push(existingGenre.idgenre);
        }

        let remainingGenres = Object.keys(genreToIds);
        if(remainingGenres.length)
        {
            let newIds = await this.addNewGenres(idArtist, remainingGenres);
            existingGenreIds = [...existingGenres, ...newIds];
        }

        return existingGenreIds;
    }

    async addGenresToArtist(idArtist, genres)
    {
        let idsToAdd = await this.getGenreIdsToAddToAuthor(idArtist, genres);
        return this.addExistingGenresToArtist(idArtist, idsToAdd);
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
            `DELETE FROM artists_genres WHERE idArtist= ? AND idGenre NOT IN (${ Array(idGenres.length).fill('?').join(',')})`,
            [idArtist, ...idGenres]
        );

        if(pendingGenresList)
        {
            let newIds = await this.getGenreIdsToAddToAuthor(idArtist, pendingGenresList);
            idGenres = [...idGenres, ...newIds];
        }

        await this.addExistingGenresToArtist(idArtist, idGenres);

    }

    static getInstance()
    {
        if(!GenreController.instance)
        {
            GenreController.instance = new GenreController();
        }
        return GenreController.instance;
    }
}

export default GenreController;