import Controller from './controllers/group'
import migrations from './migrations'
import Model from './models/group'
import routes from './routes'

export default function pluginInterface(props = {}) {

  return {
    routes
  }

}

const resources = {
  controllers: {
    Application: Controller
  },
  models: {
    Application: Model
  }
}

const settings = {
  pluginName: 'groups',
  routeName: 'groups'
}

export {migrations}
export {resources}
export {settings}
