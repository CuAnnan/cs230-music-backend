import conf from '../conf.js';
import mysql from 'mysql';

class Controller
{
    static db;
    static initialised = false;

    async query(sqlStatement, fields)
    {
        return new Promise((resolve, reject)=>{
            let qry = Controller.db.query(sqlStatement, fields, (err, results)=>{
                if(err)
                {
                    reject(err);
                }
                results.sql = qry.sql;
                resolve(results);
            });
        });
    }

    static async initialise()
    {
        return new Promise((resolve, reject)=>{
            if(Controller.initialised)
            {
                resolve();
            }


            const db = mysql.createConnection(conf.db);
            db.connect();
            Controller.db = db;
            resolve();
        });

    }
}

export default Controller;