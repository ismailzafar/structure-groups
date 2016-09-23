import migrationItems from '../../src/migrations'
import Migrations from 'structure-migrations'
import MockHTTPServer from '../helpers/mock-http-server'
import r from '../helpers/driver'

Migrations.prototype.r = r

describe('Groups', function() {

  beforeEach(function() {

    this.migration = new Migrations({
      db: 'test',
      items: migrationItems
    })

    return this.migration.process()

  })

  afterEach(function() {
    return this.migration.purge()
  })

  it('should create an group', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 1'
      })

    const group = res.body.pkg

    expect(res.body.status).to.equal(201)
    expect(group.title).to.equal('Marvolo All-Star Team 1')

    done()

  })

  it('should get by a group by Id', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 2'
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${res.body.pkg.id}`)

    const group = res2.body.pkg

    expect(res2.body.status).to.equal(200)
    expect(group.title).to.equal('Marvolo All-Star Team 2')

    done()

  })

  it('should get all groups', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 3'
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups`)

    const groups = res2.body.pkg.groups

    expect(groups.length > 0).to.be.true

    done()

  })

  it('should update a group', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 4'
      })

    var res2 = await new MockHTTPServer()
      .patch(`/api/${process.env.API_VERSION}/groups/${res.body.pkg.id}`)
      .send({
        title: 'Marvolo All-Star Team 5'
      })

    const group = res2.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 5')

    done()

  })

  it('should add a group member', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 6'
      })

    let group = res.body.pkg

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        username: 'dobby1',
        email: 'dobby1@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .send()

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${group.id}`)

    group = res2.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 6')
    expect(group.leaders.length).to.equal(0)
    expect(group.members[0].id).to.equal(user.id)

    done()

  })

  it('should add a group leader', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 7'
      })

    let group = res.body.pkg

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        username: 'dobby2',
        email: 'dobby2@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .send({
        leader: true
      })

    var res2 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${group.id}`)

    group = res2.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 7')
    expect(group.members.length).to.equal(0)
    expect(group.leaders[0].id).to.equal(user.id)

    done()

  })

  it('should remove a group member', async function(done) {

    var res = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups`)
      .send({
        title: 'Marvolo All-Star Team 8'
      })

    let group = res.body.pkg

    var res0 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/users`)
      .send({
        username: 'dobby1',
        email: 'dobby1@riddler.com',
        password: '0lds0cks'
      })

    const user = res0.body.pkg

    var res1 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/add/${user.id}`)
      .send()

    var res2 = await new MockHTTPServer()
      .post(`/api/${process.env.API_VERSION}/groups/${group.id}/remove/${user.id}`)
      .send()

    var res3 = await new MockHTTPServer()
      .get(`/api/${process.env.API_VERSION}/groups/${group.id}`)

    group = res3.body.pkg

    expect(group.title).to.equal('Marvolo All-Star Team 8')
    expect(group.leaders.length).to.equal(0)
    expect(group.members.length).to.equal(0)
    expect(group.users.length).to.equal(0)

    done()

  })

})
