import Controller from '../Controller/Controller.class.js';
import fs from 'fs/promises'

const controller = new Controller();
const tables = ["genres", "artists_genres", "albums_genres", "artists", "albums_artists", "albums", "songs", "songs_artists", "albums_songs"];
const artistMap = {};
const genreMap = {};

async function importArtists()
{
    const file = await fs.open('../data/CS230 Data(artists).csv');
    let firstLine = true;
    for await(const line of file.readLines())
    {
        if(firstLine)
        {
            firstLine = false;
        }
        else
        {
            let [artist, yearlyListens, ...genres] = line.split(',');
            genres = genres.filter(n=>n);
            for(let genre of genres)
            {
                genreMap[genre] = -1;
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