import conf from '../conf.js';
import mysql from 'mysql';


class Controller
{
    static db;
    static initialised = false;
    static instance;

    async query(sqlStatement, fields)
    {
        return new Promise((resolve, reject)=>{
            let qry = Controller.db.query(sqlStatement, fields, (err, results)=>{
                if(err)
                {
                    reject(err);
                }
                if(!results)
                {
                    results = {};
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

    static getInstance()
    {
        throw new Error("getInstance not implemented.");
    }
}

export default Controller;