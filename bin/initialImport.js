import Controller from '../Controller/Controller.class.js';
import fs from 'fs/promises'

const controller = new Controller();
const tables = ["genres", "artists_genres", "artists", "albums_artists", "albums", "songs", "albums_songs"];
const artistMap = {};
const genreMap = {};

async function importArtists()
{
    const file = await fs.open('../data/CS230 Data(artists).csv');
    let firstLine = true;
    const sqlString = "INSERT INTO artists (name, monthlyListeners) VALUES (?, ?)";
    for await(const line of file.readLines())
    {
        if(firstLine)
        {
            firstLine = false;
        }
        else
        {
            let [name, monthlyListens, ...genres] = line.split(',');
            genres = genres.filter(n=>n);
            for(let genre of genres)
            {
                genreMap[genre] = -1;
            }
            let artist = {
                name,
                monthlyListens,
                genres
            };
            artistMap[name] = artist;
            let result = await controller.query(sqlString, [artist.name, artist.monthlyListens]);
            artist.id = result.insertId;
        }
    }
}

async function importGenres()
{
    const sqlString = "INSERT INTO genres (name) VALUES (?)";
    for(let name in genreMap)
    {
        let result = await controller.query(sqlString, [name]);
        genreMap[name] = result.insertId;
    }
}

async function mapArtistGenres()
{
    const sqlString = "INSERT INTO artists_genres (idArtist, idGenre) VALUES (?, ?)";
    for(let artist of Object.values(artistMap))
    {
        for(let genre of artist.genres)
        {
            await controller.query(sqlString, [artist.id, genreMap[genre]]);
        }
    }
}

async function importAlbums()
{
    const file = await fs.open('../data/CS230 Data(albums).csv');
    let firstLine = true;
    const albumSQLString = "INSERT INTO albums (name, numberListens, releaseYear) VALUES (?, ?, ?)";
    const songSQLString = "INSERT INTO songs (name, releaseYear) VALUES (?, ?)";
    const albumSongSQLString = "INSERT INTO albums_songs (idalbum, idsong) VALUES (?, ?)";
    const albumArtistSQLString = "INSERT INTO albums_artists (idalbum, idartist) VALUES (?, ?)";

    for await(const line of file.readLines())
    {
        if (firstLine)
        {
            firstLine = false;
        }
        else
        {
            let [artistName, albumName, year, listens, ...songs] = line.split(',');
            songs = songs.filter(n=>n);
            let albumResult = await controller.query(albumSQLString, [albumName, listens, year]);
            let albumId = albumResult.insertId;
            await controller.query(albumArtistSQLString, [albumId, artistMap[artistName].id]);
            for(let song of songs)
            {
                let songResult = await controller.query(songSQLString, [song, year]);
                let songId = songResult.insertId;
                await controller.query(albumSongSQLString, [albumId, songId]);
            }
        }
    }
}

Controller.initialise().then(async ()=>{
    let result = await controller.query("SET foreign_key_checks = 0");
    for(let table of tables)
    {
        let result = await controller.query("TRUNCATE TABLE "+table);
    }
    await importArtists();
    await importGenres();
    await mapArtistGenres();
    await importAlbums();
    result = await controller.query("SET foreign_key_checks = 1");
}).then(()=>{
    console.log("Initial import done");
    Controller.db.end(function(err){
        if(!err)
        {
            console.log("DB closed");
        }
        else
        {
            console.log(err);
        }
    });
});