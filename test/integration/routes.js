import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import pluginsList from '../helpers/plugins'

const server = new MockHTTPServer()

const createOrgAndApp = async function(){
  // getting an organization and application Ids
  var res0 = await new MockHTTPServer()
    .post(`/api/${process.env.API_VERSION}/organizations`)
    .send({
      title: 'work it'
    })

  const org = res0.body.pkg
  const orgId = org.id

  var app = await new MockHTTPServer()
    .post(`/api/${process.env.API_VERSION}/applications`)
    .set('organizationid', orgId)
    .send({
      desc: '',
      title: 'App 45'
    })

  const appId = app.body.pkg.id

  return {orgId, appId}

}

describe('Groups', function() {

  beforeEach(function() {

    this.migration = new Migrations({
      db: 'test',
      plugins: pluginsList
    })

    return this.migration.process()

  })

  afterEach(function() {
    return this.migration.purge()
  })

  it('should create an group', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 1'
      })

    const group = res.body.pkg

    expect(res.body.status).to.equal(201)
    expect(group.title).to.equal('Marvolo All-Star Team 1')

  })

  it('should get by a group by Id', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 2'
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${res.body.pkg.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    const group = res2.body.pkg

    expect(res2.body.status).to.equal(200)
    expect(group.title).to.equal('Marvolo All-Star Team 2')

  })

  it('should get all groups', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 3'
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    const groups = res2.body.pkg.groups
    expect(groups.length > 0).to.be.true

  })

  it('should update a group', async function() {

    const {orgId, appId} = await createOrgAndApp()

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 4'
      })

    var res2 = await new MockHTTPServer()
      .patch(`/api/${process.env.API_VERSION}/groups/${res.body.pkg.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 5'
      })

    const group = res2.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 5')

  })

  it('should delete a group', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const server = new MockHTTPServer()

    var res = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 3'
      })

    const group = res.body.pkg

    var res1 = await server
      .delete(`/api/${process.env.API_VERSION}/groups/${group.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    var res2 = await server
      .get(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    const groups = res2.body.pkg.groups

    expect(groups.length).to.equal(0)

  })

  it('should destroy a group', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const server = new MockHTTPServer()

    var res = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 3'
      })

    const group = res.body.pkg

    var res1 = await server
      .delete(`/api/${process.env.API_VERSION}/groups/${group.id}/destroy`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    var res2 = await server
      .get(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    const groups = res2.body.pkg.groups

    expect(groups.length).to.equal(0)

  })

  it('should add a group member', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const orgRes = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: "Deathly Cannons"
      })

    const org = orgRes.body.pkg

    var res = await server
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 6'
      })

    let group = res.body.pkg

    var res0 = await server
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        organizationId: org.id,
        username: 'dobby1',
        email: 'dobby1@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${group.id}/members`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    group = res2.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 6')
    expect(group.members[0].id).to.equal(user.id)

  })

  it('should add a group leader', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const orgRes = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: "Deathly Cannons"
      })

    const org = orgRes.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 7'
      })

    let group = res.body.pkg

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        organizationId: org.id,
        username: 'dobby2',
        email: 'dobby2@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        leader: true
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${group.id}/leaders`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    group = res2.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 7')
    expect(group.leaders[0].id).to.equal(user.id)

  })

  it('should remove a group member', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const orgRes = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: "Deathly Cannons"
      })

    const org = orgRes.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 8'
      })

    let group = res.body.pkg

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        organizationId: org.id,
        username: 'dobby1',
        email: 'dobby1@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res2 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/remove/${user.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res3 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${group.id}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    group = res3.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 8')
    expect(group.users.length).to.equal(0)

  })

  it('should get groups of a user', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const orgRes = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: "Deathly Cannons"
      })

    const org = orgRes.body.pkg

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 7'
      })

    let group = res.body.pkg

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        organizationId: org.id,
        username: 'dobby1',
        email: 'dobby1@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/of/users/${user.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    const groups = res2.body.pkg.groups

    expect(groups.length > 0).to.be.true

  })

  /*
  NOTE:
  User 1 is added to 1 group, and deleted from 1 group. Should have 0 groups at the end.
  User 2 is added to 2 groups, and deleted from 1 group. Should have 1 group at the end.
  */
  it('should remove a user from a group when deleting a group', async function() {

    const {orgId, appId} = await createOrgAndApp()

    const orgRes = await server
      .post(`/api/${process.env.API_VERSION}/organizations`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: "Deathly Cannons"
      })

    const org = orgRes.body.pkg
    const version = process.env.API_VERSION

    var res = await server
      .post(`/api/${version}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 8'
      })

    const group1 = res.body.pkg

    var resG = await server
      .post(`/api/${version}/groups`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        title: 'Marvolo All-Star Team 9'
      })

    const group2 = resG.body.pkg

    var res0 = await server
      .post(`/api/${version}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        organizationId: org.id,
        username: 'dobby1',
        email: 'dobby1@riddler.com',
        password: '0lds0cks'
      })

    var res1 = await server
      .post(`/api/${version}/users`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send({
        organizationId: org.id,
        username: 'dobby2',
        email: 'dobby2@riddler.com',
        password: '0lds0cks'
      })

    const user1 = res0.body.pkg
    const user2 = res1.body.pkg

    var res1a = await server
      .post(`/api/${version}/groups/${group1.id}/add/${user1.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res1b = await server
      .post(`/api/${version}/groups/${group1.id}/add/${user2.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res1c = await server
      .post(`/api/${version}/groups/${group2.id}/add/${user2.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res2 = await server
      .delete(`/api/${version}/groups/${group1.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)
      .send()

    var res3 = await server
      .get(`/api/${version}/groups/of/users/${user1.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    var res4 = await server
      .get(`/api/${version}/groups/of/users/${user2.id}`)
      .set('organizationid', orgId)
      .set('applicationid', appId)

    const groups1 = res3.body.pkg.groups
    const groups2 = res4.body.pkg.groups

    expect(groups1.length).to.equal(0)
    expect(groups2.length).to.equal(1)

  })

})
