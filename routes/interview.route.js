const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interview.controller');

router.get('/questions', interviewController.getQuetions);

router.get('/getbyid/:id', interviewController.getById);

router.post('/getResult', interviewController.reviewQuestions )

module.exports = router;