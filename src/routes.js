import Controller from './controllers/group'
import Dispatcher from 'structure-dispatcher'

const controller = new Controller()
const dispatcher = new Dispatcher()
const dispatch = dispatcher.dispatch
const respond = dispatcher.respond
const express = require('express')
const routes = express.Router()

routes.get('/of/users/:id',        dispatch(controller, 'ofUser'), respond())
routes.post(`/:id/add/:userId`,    dispatch(controller, 'addUser'), respond())
routes.post(`/:id/remove/:userId`, dispatch(controller, 'removeUser'), respond())

routes.get(`/:id/leaders`,         dispatch(controller, 'getLeaders'), respond())
routes.get(`/:id/members`,         dispatch(controller, 'getMembers'), respond())
routes.get(`/:id/users`,           dispatch(controller, 'getUsers'), respond())
routes.get(`/:id`,                 dispatch(controller, 'getById'), respond())
routes.get(`/`,                    dispatch(controller, 'getAll'), respond())

routes.patch(`/:id`,               dispatch(controller, 'updateById'), respond())

routes.post(`/`,                   dispatch(controller, 'create'), respond())

routes.delete(`/:id/destroy`,      dispatch(controller, 'destroyById'), respond())
routes.delete(`/:id`,              dispatch(controller, 'deleteById'), respond())

export default function routesHandler(options = {}) {

  return {
    routeName: 'groups',
    routes
  }

}
