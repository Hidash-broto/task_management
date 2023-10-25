const router = require('express').Router();
const { getAllDatas, addTask, editTask, deleteTask } = require('../controllers/controllers')

router.get('/getAllDatas', getAllDatas);
router.post('/addTask', addTask);
router.post('/editTask', editTask);
router.post('/deleteTask', deleteTask);

module.exports = router