import Controller from './controllers/group'
import Dispatcher from 'structure-dispatcher'

const controller = new Controller()
const dispatch = new Dispatcher().dispatch
const express = require('express')
const routes = express.Router()

routes.get('/of/users/:id',        dispatch(controller, 'ofUser'))
routes.post(`/:id/add/:userId`,    dispatch(controller, 'addUser'))
routes.post(`/:id/remove/:userId`, dispatch(controller, 'removeUser'))

routes.get(`/:id/leaders`,         dispatch(controller, 'getLeaders'))
routes.get(`/:id/members`,         dispatch(controller, 'getMembers'))
routes.get(`/:id/users`,           dispatch(controller, 'getUsers'))
routes.get(`/:id`,                 dispatch(controller, 'getById'))
routes.get(`/`,                    dispatch(controller, 'getAll'))

routes.patch(`/:id`,               dispatch(controller, 'updateById'))

routes.post(`/`,                   dispatch(controller, 'create'))

routes.delete(`/:id`,              dispatch(controller, 'deleteById'))

export default function routesHandler(options = {}) {

  return {
    routeName: 'groups',
    routes
  }

}
