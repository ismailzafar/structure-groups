import logger from 'structure-logger'
import r from 'structure-driver'
import RootModel from 'structure-root-model'

/**
 * GroupModel Class
 *
 * @public
 * @class GroupModel
 */
export default class GroupModel extends RootModel {

 /**
  * GroupModel constructor
  *
  * @public
  * @constructor
  * @param {Object} options - Options
  */
 constructor(options = {}) {
   super(Object.assign({}, {
     table: 'groups',

     relations: {
       hasMany: [
         {
           node: 'users',
           link: {
             foreignKey: 'userId',
             localKey: 'groupId'
           },
           joinTable: 'link_groups_users'
         }
       ]
     }
   }, options))
 }

 /**
  * Reference a user to a group
  *
  * @param {Object} pkg - The options
  */
 createReference(pkg = {}) {

   return super.createReference(pkg, {table: 'link_groups_users'})

 }

 /**
  * Unreference a user to a group
  *
  * @param {Object} pkg - The options
  */
 deleteReference(pkg = {}) {

   return super.deleteReference(pkg, {table: 'link_groups_users'})

 }

 getAll(ids = [], options = {}) {

   const organizationId = options.organizationId

   return new Promise( async (resolve, reject) => {

     try {

       let query = r
         .table(this.table)

        if(ids.length > 0) {

          query = query
            .getAll(r.args(ids))

        }
        else {

          query = query
            .getAll(organizationId, {index: 'organizationId'})

        }

        query = query
          .filter( (doc) => {
            return doc('status').eq('active')
          })

        const res = await query.run()

        resolve(res)

     }
     catch(e) {
       logger.error(e)

       reject(e)
     }

   })

 }

 /**
  * Get leaders of a group
  *
  * @param {String} id
  */
 getLeaders(id) {

   return new Promise( async (resolve, reject) => {

     let data  = null
     let group = null
     const status = ['active']

     const initGroupData = {
       leaders: []
     }

     try {

       data = await r
         .table('groups')
         .getAll(id)
         .eqJoin('id', r.table('link_groups_users'), {index: 'groupId'})
         .eqJoin(r.row('right')('userId'), r.table('users'), {index: 'id'})
         .filter( (doc) => {
           return doc('right')('status').eq('active')
         })

       // The group has no members
       if(!data || data.length == 0) {
         // Prevent next for loop from running
         data = {
           length: 0
         }

         group = Object.assign({}, await RootModel.prototype.getById.call(this, id), initGroupData)
       }
     }
     catch(e) {
       return reject(e)
     }

     for(let i = 0, l = data.length; i < l; i++) {
       const item = data[i]
       const leader = item.left.right.leader
       const user = item.right

       if(!group) group = Object.assign({}, item.left.left, initGroupData)

       if(leader) {
         group.leaders.push(user)
       }

     }

     resolve(group)

   })

 }

 /**
  * Get members of a group
  *
  * @param {String} id
  */
 getMembers(id) {

   return new Promise( async (resolve, reject) => {

     let data  = null
     let group = null
     const status = ['active']

     const initGroupData = {
       members: []
     }

     try {

       data = await r
         .table('groups')
         .getAll(id)
         .eqJoin('id', r.table('link_groups_users'), {index: 'groupId'})
         .eqJoin(r.row('right')('userId'), r.table('users'), {index: 'id'})
         .filter( (doc) => {
           return doc('right')('status').eq('active')
         })

       // The group has no members
       if(!data || data.length == 0) {
         // Prevent next for loop from running
         data = {
           length: 0
         }

         group = Object.assign({}, await RootModel.prototype.getById.call(this, id), initGroupData)
       }
     }
     catch(e) {
       return reject(e)
     }

     for(let i = 0, l = data.length; i < l; i++) {
       const item = data[i]
       const leader = item.left.right.leader
       const user = item.right

       if(!group) group = Object.assign({}, item.left.left, initGroupData)

       if(!leader) {
         group.members.push(user)
       }

     }

     resolve(group)

   })

 }

  /**
   * Get users of a group
   *
   * @param {String} id
   */
  getUsers(id) {

    return new Promise( async (resolve, reject) => {

      let data  = null
      let group = null
      const status = ['active']

      const initGroupData = {
        leaders: [],
        members: [],
        users: []
      }

      try {

        data = await r
          .table('groups')
          .getAll(id)
          .eqJoin('id', r.table('link_groups_users'), {index: 'groupId'})
          .eqJoin(r.row('right')('userId'), r.table('users'), {index: 'id'})
          .filter( (doc) => {
            return doc('right')('status').eq('active')
          })

        // The group has no members
        if(!data || data.length == 0) {
          // Prevent next for loop from running
          data = {
            length: 0
          }

          group = Object.assign({}, await RootModel.prototype.getById.call(this, id), initGroupData)
        }
      }
      catch(e) {
        return reject(e)
      }

      for(let i = 0, l = data.length; i < l; i++) {
        const item = data[i]
        const leader = item.left.right.leader
        const user = item.right

        if(!group) group = Object.assign({}, item.left.left, initGroupData)

        group.users.push(user)

        if(leader) {
          group.leaders.push(user)
        } else {
          group.members.push(user)
        }

      }

      resolve(group)

    })

  }

  /**
   * Get groups of a user
   *
   * @param {String} id
   */
  ofUser(id) {

    return new Promise( async (resolve, reject) => {

      let groups = []

      try {

        const res = await r
          .table('users')
          .getAll(id)
          .eqJoin('id', r.table('link_groups_users'), {index: 'userId'})
          .eqJoin(r.row('right')('groupId'), r.table('groups'), {index: 'id'})

        for(let i = 0, l = res.length; i < l; i++) {
          const group = res[i]

          groups.push(group.right)
        }

        resolve({groups})

      }
      catch(e) {
        reject(e)
      }

    })

  }

}
