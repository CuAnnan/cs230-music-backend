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
            let stmt = Controller.db.query(sqlStatement, fields, (err, results)=>{
                let query = {
                    sql:stmt.sql,
                    qry:stmt,
                    results:[],
                    hasResults:false
                }


                if(err)
                {
                    reject(err);
                }
                if(results)
                {
                    query.results = results;
                    query.hasResults = results.length > 0;
                }


                resolve(query);
            });
        });
    }

    async beginTransaction()
    {
        await this.query("START TRANSACTION");
    }

    async commit()
    {
        await this.query("COMMIT");
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