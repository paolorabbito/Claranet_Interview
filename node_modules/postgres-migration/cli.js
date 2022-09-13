#!/usr/bin/env node
require('dotenv').config({ path: require('find-config')('.env') })


const { log } = require("console");
const fs = require("fs");
const pg = require("pg");

const [,, ...args] = process.argv;

const connectionString = process.env.DATABASE_URL || args[0];
console.log(`Database Connection URL: ${connectionString}`);

if(connectionString) {
    const Pool = pg.Pool;
    const pool = new Pool({
        connectionString
    });

    function readDirPromise(folder) {
        return new Promise(function (accept, reject) {
            fs.readdir("sql/", (err, files) => {
                if (err) {
                    return reject(err);
                }
                accept(files);
            });
        })
    }

    async function createMigrationsTable() {
        const sql = `create table if not exists migrations (last_migration integer not null);`
        await pool.query(sql);
        const results = await pool.query(`select count(*) from migrations`);

        if (results.rows[0].count == 0) {
            await pool.query(`insert into migrations (last_migration) values(0)`);
        }

    }

    async function getNextMigrationIndex() {
        const sql = `select last_migration from migrations`;
        const result = await pool.query(sql);

        if (result.rows.length == 0) {
            return -1
        } else {
            return result.rows[0].last_migration
        }
    }

    async function updateMigrationIndex() {
        const sql = `update migrations set last_migration = last_migration + 1`;
        await pool.query(sql);
    }

    async function seedMigrationIndex(index) {
        const sql = `update migrations set last_migration = $1`;
        await pool.query(sql, [index]);
    }

    async function migrate() {
        const files = await readDirPromise("sql/");
        const sqlFiles = files.filter(fileName => fileName.endsWith(".sql"));
        await createMigrationsTable();

        const nextIndex = await getNextMigrationIndex();
        const sqlScriptsToExecute = sqlFiles.filter(fileName => {
            const currentFileIndex = Number(fileName.split("-")[0]);
            return currentFileIndex > nextIndex
        });

        if (sqlScriptsToExecute.length === 0) {
            console.log("No migrations found")
        } else {
            console.log(`${sqlScriptsToExecute.length} migrations found`);
        }

        for (const sqlScript of sqlScriptsToExecute) {
            console.log(`Running : ${sqlScript}`);
            const sql = fs.readFileSync("sql/" + sqlScript, "utf-8");
            await pool.query(sql);
            await updateMigrationIndex();
            console.log(`Migration executed : ${sqlScript}`);
        }
    }

    async function executeSql(sql) {
        console.log(`Running sql: ${sql}`);
        const result = await pool.query(sql);
        console.log(result.rows);
    }

    const command = process.argv[2];

    (async () => {
        try {
            switch (command) {
                case 'index':
                    const index = await getNextMigrationIndex();
                    console.log(`Current migration index: ${index}`);
                    break;
                case 'execute':
                    const sql = process.argv[3]
                    await executeSql(sql);
                    break;
                case 'seed':
                    const migrationIndex = Number(process.argv[3]);
                    console.log(`Setting current migration index to: ${migrationIndex}`);
                    await seedMigrationIndex(migrationIndex);
                default:
                    await migrate();
            }
        } catch (err) {
            console.log(err)
        } finally {
            pool.end();
        }
    })();
} else {
    console.log(`Database url not provided`);
}

