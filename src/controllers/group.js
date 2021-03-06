import GroupModel from '../models/group'
import RootController from 'structure-root-controller'

/**
 * GroupsController Class
 *
 * @public
 * @class GroupsController
 */
export default class GroupsController extends RootController {

  /**
   * GroupsController constructor
   *
   * @public
   * @constructor
   * @param {Object} options - Options
   */
  constructor(options = {}) {
    super(Object.assign({}, {
     name: 'groups'
    }, options))
  }

  /**
   * Add a user to a group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  addUser(req, res) {

    const group   = new GroupModel()
    const groupId = req.params.id
    const pkg     = req.body || {}

    const userId  = req.params.userId

    return new Promise( async (resolve, reject) => {

      try {
        await group.createReference({
          groupId,
          leader: (pkg.leader) ? true : false,
          userId
        })
      }
      catch(e) {
        return reject(e)
      }

      resolve({
        addLeader: (pkg.leader) ? true : false,
        addUser: true,
        groupId,
        userId: pkg.userId
      })

    })

  }

  /**
   * Create new group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  create(req, res) {

    const group = new GroupModel()
    const pkg = req.body

    if(!pkg.organizationId) {
      pkg.organizationId = req.headers.organizationid
    }

    pkg.status = 'active'

    return group.create(pkg)

  }

  /**
   * Delete a group by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  deleteById(req, res) {

    const group = new GroupModel()

    const groupId = req.params.id

    return group.deleteById(groupId)

  }

  /**
   * Destroy a group by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  destroyById(req, res) {

    const group = new GroupModel()

    const groupId = req.params.id

    return group.destroyById(groupId)

  }

  /**
   * Get all groups
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getAll(req, res) {

    const group = new GroupModel()

    return group.getAll([], {
      applicationId: req.headers.applicationid,
      organizationId: req.headers.organizationid
    })

  }

  /**
   * Get group by id
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getById(req, res) {

    const group = new GroupModel()

    return group.getById(req.params.id)

  }

  /**
   * Get leaders in a group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getLeaders(req, res) {

    const group = new GroupModel()

    return group.getLeaders(req.params.id)

  }

  /**
   * Get members in a group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getMembers(req, res) {

    const group = new GroupModel()

    return group.getMembers(req.params.id)

  }

  /**
   * Get users in a group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  getUsers(req, res) {

    const group = new GroupModel()

    return group.getUsers(req.params.id)

  }

  /**
   * Get groups of a user
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  ofUser(req, res) {

    const group = new GroupModel()

    return group.ofUser(req.params.id)

  }

  /**
   * Remove a user from a group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  removeUser(req, res) {

    const group   = new GroupModel()
    const groupId = req.params.id
    const userId  = req.params.userId

    return new Promise( async (resolve, reject) => {

      try {
        await group.deleteReference({
          groupId,
          userId
        })
      }
      catch(e) {
        return reject(e)
      }

      resolve({
        groupId,
        removedUser: true,
        userId
      })

    })

  }

  /**
   * Update a group
   *
   * @public
   * @param {Object} req - Express req
   * @param {Object} res - Express res
   */
  updateById(req, res) {

    const group = new GroupModel()

    return group.updateById(req.params.id, req.body)

  }

}
