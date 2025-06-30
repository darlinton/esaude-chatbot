const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitEvaluation, getEvaluationBySession } = require('../controllers/evaluationController');

router.route('/').post(protect, submitEvaluation);
router.route('/:sessionId').get(protect, getEvaluationBySession);

module.exports = router;
