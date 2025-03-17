import Controller from "./Controller.class.js";

class SongController extends Controller
{
    static instance;

    async getSongsByIdAlbum(idAlbum)
    {
        return this.query(
        "SELECT s.idSong, s.name " +
                    "FROM songs s LEFT JOIN " +
                    "albums_songs a_s USING (idSong) " +
                    "WHERE a_s.idAlbum = ?",
                    [idAlbum]
        );
    }

    static getInstance()
    {
        if(!SongController.instance)
        {
            SongController.instance = new SongController();
        }
        return SongController.instance;
    }
}

export default SongController;