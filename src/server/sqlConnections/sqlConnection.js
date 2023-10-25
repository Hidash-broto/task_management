const sql = require('mysql');

const db = sql.createConnection({
    host: 'localhost',
    user: 'HIDASH',
    password: '',
    database: 'interval_mechine_task'
})

db.connect((err) => {
    if (err) {
        console.log(err.message)
        return
    }
    console.log('Connected to mysql database')
})

module.exports = db