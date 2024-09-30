const express = require('express');
const router = express.Router();

const appointmentsRoutes = require('./appointmentsRoutes');
const eventsRoutes = require('./eventsRoutes');
const professionalsRoutes = require('./professionalsRoutes');
const studentsRoutes = require('./studentsRoutes');
const teachersRoutes = require('./teachersRoutes');
const usersRoutes = require('./usersRoutes');


router.use('/appointments', appointmentsRoutes);
router.use('/events', eventsRoutes);
router.use('/professionals', professionalsRoutes);
router.use('/students', studentsRoutes);
router.use('/teachers', teachersRoutes);
router.use('/users', usersRoutes);

module.exports = router;