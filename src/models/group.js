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

     permissions: {
       create:  ['admin'],
       delete:  ['admin'],
       read:    ['organization'],
       replace: ['admin'],
       update:  ['admin'],
     },
     relations: {
       belongsTo: [
         {
           node: 'organizations',
           link: {
             foreignKey: 'organizationId',
             localKey: 'groupId'
           },
           joinTable: 'link_organizations_groups'
         }
       ],
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

 /**
  * Get leaders of a group
  *
  * @param {String} id
  */
 getLeaders(id) {

   return new Promise( async (resolve, reject) => {

     let data  = null
     let group = null

     const initGroupData = {
       leaders: []
     }

     try {

       data = await this.r
         .table('groups')
         .getAll(id)
         .eqJoin('id', this.r.table('link_groups_users'), {index: 'groupId'})
         .eqJoin(this.r.row('right')('userId'), this.r.table('users'), {index: 'id'})

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

     const initGroupData = {
       members: []
     }

     try {

       data = await this.r
         .table('groups')
         .getAll(id)
         .eqJoin('id', this.r.table('link_groups_users'), {index: 'groupId'})
         .eqJoin(this.r.row('right')('userId'), this.r.table('users'), {index: 'id'})

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

      const initGroupData = {
        leaders: [],
        members: [],
        users: []
      }

      try {

        data = await this.r
          .table('groups')
          .getAll(id)
          .eqJoin('id', this.r.table('link_groups_users'), {index: 'groupId'})
          .eqJoin(this.r.row('right')('userId'), this.r.table('users'), {index: 'id'})

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

  ofUser(id) {

    return new Promise( async (resolve, reject) => {

      let groups = []

      try {

        const res = await this.r
          .table('users')
          .getAll(id)
          .eqJoin('id', this.r.table('link_groups_users'), {index: 'userId'})
          .eqJoin(this.r.row('right')('groupId'), this.r.table('groups'), {index: 'id'})

        for(let i = 0, l = res.length; i < l; i++) {
          const group = res[i]

          groups.push(group.right)
        }

        resolve(groups)

      }
      catch(e) {
        reject(e)
      }

    })

  }

}
