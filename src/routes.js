import Dispatcher from 'structure-dispatcher'

const dispatch = new Dispatcher().dispatch
const express  = require('express')
const routes   = express.Router()

export default function routeInterface(props = {}) {

  const controller = new props.Controller()

  routes.post(`/:id/add/:userId`,    dispatch(controller, 'addUser'))
  routes.post(`/:id/remove/:userId`, dispatch(controller, 'removeUser'))

  routes.get(`/:id/users`,           dispatch(controller, 'getUsers'))
  routes.get(`/:id`,                 dispatch(controller, 'getById'))
  routes.get(`/`,                    dispatch(controller, 'getAll'))

  routes.patch(`/:id`,               dispatch(controller, 'updateById'))

  routes.post(`/`,                   dispatch(controller, 'create'))

  routes.delete(`/:id`,              dispatch(controller, 'deleteById'))

  return routes

}
