const Sequelize = require('sequelize');
const config = require('./config/default.json');
const cron = require('node-cron');
const Automate = require('sequelize-automate');
const fs = require('fs');
let tableList = [];

const sequelize_master = new Sequelize(config.databases.master.database, config.databases.master.username, config.databases.master.password, {
    host: config.databases.master.host,
    dialect: config.databases.master.dialect,
    define: {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    },
    dialectOptions: {
        multipleStatements: true
    },
    logging: false
});

const sequelize_slave = new Sequelize(config.databases.slave.database, config.databases.slave.username, config.databases.slave.password, {
    host: config.databases.slave.host,
    dialect: config.databases.slave.dialect,
    schema: config.databases.slave.schema,
    define: {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    },
    dialectOptions: {
        multipleStatements: true
    },
    logging: false
});


sequelize_master.authenticate()
    .then(() => {
        console.info('Master Database connected.');
        insertTestDataIntoMySql();
        sequelize_slave.authenticate()
            .then(() => {
                console.info('Slave Database connected.');
                scheduleCronJob();
            })
            .catch(err => {
                console.error('Unable to connect to the Slave Database:', err)
            });
    })
    .catch(err => {
        console.error('Unable to connect to the Master Database:', err)
    })



function scheduleCronJob() {
    console.log('\x1b[33m%s\x1b[0m', "Cron Job Scheduled for every "+ config.cronTimeInMinutes+"m");
    cron.schedule('*/'+config.cronTimeInMinutes+' * * * *', () => {
        syncDatabases();
        console.log('\x1b[33m%s\x1b[0m', "Cron Executed at :: "+new Date().toString());
    });
}

function syncDatabases() {
    console.log("Syncing tables..."+config.tablesTobeSynced);
    sequelize_master.query('SELECT TABLE_NAME FROM ' +config.databases.master.database+'.INFORMATION_SCHEMA.TABLES;').then(function(tableObj) {
        tableList = [];
        tableObj[0].forEach(table=>{
             tableList.push(table["TABLE_NAME"]);
        });
        //console.log(JSON.stringify(rows));
        //tableList = rows;
        console.log("tableList :: "+tableList);
        tablesToBeSynched = config.tablesTobeSynced.includes("All") ? tableList : config.tablesTobeSynced;
        tablesToBeSynched.forEach(ttbs => {
            let fileName = './models/' + ttbs;
            let model = require(fileName)(sequelize_master);
            model.findAll({ raw: true }).then(function (data) {
                let slaveModel = require(fileName)(sequelize_slave);
                slaveModel.sync({ alter: true }).then(function () {
                    slaveModel.bulkCreate(data,
                        {
                            returning: false,
                            updateOnDuplicate: ["id"]
                        }).then(function (d) {
                            console.log('\x1b[33m%s\x1b[0m',"Table synched successfully :: " + ttbs);
                        });
                });
            });
        });
    })
    .catch((err) => {
        console.log('showAllSchemas ERROR for MasterDB :',err);
    })
}



// Database options, is the same with sequelize constructor options.
const dbOptions = {
    database: config.databases.master.database,
    username: config.databases.master.username,
    password: config.databases.master.password,
    dialect: config.databases.master.dialect,
    host: config.databases.master.host,
    port: config.databases.master.port,
    define: {
        underscored: false,
        freezeTableName: false,
        charset: 'utf8mb4',
        timezone: '+00:00',
        dialectOptions: {
            collate: 'utf8_general_ci',
        },
        timestamps: false,
        createdAt: false,
        updatedAt: false
    },
};

// Automate options for model generation
const options = {
    type: 'js', // Which code style want to generate, supported: js/ts/egg/midway. Default is `js`.
    camelCase: false, // Model name camel case. Default is false.
    fileNameCamelCase: true, // Model file name camel case. Default is false.
    dir: 'models', // What directory to place the models. Default is `models`.
    typesDir: 'models', // What directory to place the models' definitions (for typescript), default is the same with dir.
    emptyDir: true, // Remove all files in `dir` and `typesDir` directories before generate models.
    tables: null, // Use these tables, Example: ['user'], default is null.
    skipTables: null, // Skip these tables. Example: ['user'], default is null.
    tsNoCheck: false, // Whether add @ts-nocheck to model files, default is false.
}

function automateModelGeneration() {
    const automate = new Automate(dbOptions, options);

    (async function main() {
        // // get table definitions
        // const definitions = await automate.getDefinitions();
        // console.log(definitions);

        // or generate codes
        const code = await automate.run();
        console.log("Models created successfully");
    })()
}

function insertTestDataIntoMySql(){
    sequelize_master.query(fs.readFileSync("./scripts/sql.sql",'utf8')).then(function(){
        console.log("Test records inserted into Master DB");
        automateModelGeneration();
    });
}
