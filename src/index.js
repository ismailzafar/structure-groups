import Controller from './controllers/group'
import migrations from './migrations'
import Model from './models/group'
import routes from './routes'

export default function pluginInterface(options = {}) {

  return routes(options)

}

const resources = {
  controllers: {
    Group: Controller
  },
  models: {
    Group: Model
  }
}

const settings = {
  migrations,
  pluginName: 'groups'
}

export {resources}
export {settings}
