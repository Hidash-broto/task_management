const db = require('../sqlConnections/sqlConnection')
const dayjs = require('dayjs');
const fs = require('fs')
const path = require('path');

module.exports = {
    getAllDatas: async (req, res) => {
        try {
            db.query('select * from tasks', (err, result) => {
                if (err) {
                    console.log(err.message)
                    res.json({ status: false, message: 'Please try again' })
                } else {
                    const sortedData = result.map((row) => {
                        const dateAndTime = dayjs(row.dateAndTime);
                        return { ...row, dateAndTime };
                    });
                    sortedData.sort((a, b) => a.dateAndTime - b.dateAndTime);
                    res.json({ status: true, tasks: sortedData })
                }
            })
        } catch (error) {
            console.log(error.message)
            res.json({ status: false, message: 'Something went wrong' })
        }
    },
    addTask: (req, res) => {
        try {
            const { heading, description, dateAndTime, priority } = req.body;
            const image = req.file;
            const sql = 'INSERT tasks (heading, description, dateAndTime, image, priority) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [heading, description, dateAndTime, image.filename, priority], (err, result) => {
                if (err) {
                    console.log(err.message);
                    res.json({ status: false, message: 'Try again' })
                } else {
                    res.json({ status: true, message: 'Task added Successfully' })
                }
            })
        } catch (error) {
            console.log(error.message);
            res.json({ status: false, message: 'Something went Wrong' })
        }
    },
    editTask: (req, res) => {
        try {
            const { heading, description, dateAndTime, priority, imageStatus } = req.body;
            const image1 = req.file
            const query = 'UPDATE tasks SET ? WHERE heading = ?';
            db.query(query, [{ heading, description, dateAndTime, priority }, heading], (err, result) => {
                if (err) {
                    res.json({ status: false, message: 'Please try again' })
                } else {
                    res.json({ status: true, message: 'Updated Successfully' })
                }
            })
            if (imageStatus) {
                let image = image1.filename
                db.query('UPDATE tasks SET image = ? WHERE heading = ?', [image, heading], (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(result)
                    }
                })
            }
        } catch (error) {
            res.json({status: false, message: 'Please try again'})
            console.log(error.message)
        }
    },
    deleteTask: (req, res) => {
        try {
            const { heading } = req.body;
            let imageName = ''
            const query = 'select * from tasks where heading = ?'
            db.query(query, [heading], (err, result) => {
                if (err) {
                    console.log(err.message)
                } else {
                    imageName = result[0].image
                    const deleteQuery = 'DELETE FROM tasks WHERE heading = ?';
                    db.query(deleteQuery, [heading], (err, result) => {
                        if (err) {
                            console.log(err.message)
                        } else {
                            const relativeImagePath = `../images/${imageName}`;
                            const imagePath = path.resolve(__dirname, relativeImagePath);
                            console.log(imagePath)
                            fs.unlink(imagePath, (err) => {
                                if (err) {
                                } else {
                                    console.log(`Image ${relativeImagePath} has been deleted successfully.`);
                                }
                            });
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error.message)
            res.json({status: false, messsage: 'Please try again'})
        }
    }
}