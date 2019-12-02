const router = require('express').Router()
const {Routine, Interval, User, Workout} = require('../db/models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const db = require('../db')

router.get('/', async (req, res, next) => {
  console.log('entering api')
  try {
    const routines = await Routine.findAll({
      where:{
        userId:req.user.id
      },
      include: [{model: Interval}, {model: User}, {model: Workout}]
    })
    res.json(routines)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {user, body} = req
    const {routineName, routineType, routine, makePublic} = body
    let newRoutine = await Routine.create({
      name: routineName,
      activityType: routineType,
      makePublic
    })
    await newRoutine.setUser(user.id)
    if (!newRoutine) throw new Error('Routine not created')
    await newRoutine.setIntervals(
      await Promise.all(
        routine.map(interval =>
          Interval.create({
            cadence: interval.cadence,
            duration: interval.duration,
            activityType: interval.intervalType
          })
        )
      )
    )
    newRoutine = await Routine.findByPk(newRoutine.id, {include: [Interval]})
    console.log('newRoutine', newRoutine)
    res.status(201).json(newRoutine)
  } catch (err) {
    next(err)
  }
})

module.exports = router
