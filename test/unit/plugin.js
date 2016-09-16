import express        from 'express'
import Plugin         from '../../src/index'
import request        from 'supertest-as-promised'
import {RootController, RootModel} from 'structure-test-helpers'

const props = {
  Controller: RootController,
  Model: RootModel
}

describe('Plugin', function() {

  it('should initialize', function() {

    const plugin = new Plugin(props)

    expect(plugin.routeName).to.equal('groups')

  })

  it('should create a group', async function() {

    const plugin = new Plugin(props)
    const route  = `/${plugin.routeName}`
    const server = express()

    server.use(route, plugin.routes)

    const res = await request(server)
      .post('/groups')
      .send({
        foo: 'bar'
      })

    const group = res.body.pkg

    expect(group).to.be.an('object')

  })

  it('should get a group by Id', async function() {

    const plugin = new Plugin(props)
    const route  = `/${plugin.routeName}`
    const server = express()

    server.use(route, plugin.routes)

    const res = await request(server)
      .post('/groups')
      .send({
        foo: 'bar'
      })

    const group = res.body.pkg

    const res2 = await request(server).get(`/groups/${group.id}`)

    const group2 = res2.body.pkg

    expect(group2).to.be.an('object')

  })

  it('should get all groups', async function() {

    const plugin = new Plugin(props)
    const route  = `/${plugin.routeName}`
    const server = express()

    server.use(route, plugin.routes)

    const res = await request(server).get('/groups')

    const groups = res.body.pkg.groups

    expect(groups).to.be.an('array')

  })

  it('should update a group by Id', async function() {

    const plugin = new Plugin(props)
    const route  = `/${plugin.routeName}`
    const server = express()

    server.use(route, plugin.routes)

    const res = await request(server)
      .post('/groups')
      .send({
        foo: 'bar'
      })

    const group = res.body.pkg

    const res2 = await request(server)
      .patch(`/groups/${group.id}`)
      .send({
        foo: 'bar'
      })

    const res3 = await request(server).get(`/groups/${group.id}`)

    const group2 = res3.body.pkg

    expect(group2).to.be.an('object')

  })

  it('should delete a group by Id', async function() {

    const plugin = new Plugin(props)
    const route  = `/${plugin.routeName}`
    const server = express()

    server.use(route, plugin.routes)

    const res = await request(server)
      .post('/groups')
      .send({
        foo: 'bar'
      })

    const group = res.body.pkg

    const res2 = await request(server)
      .patch(`/groups/${group.id}`)
      .send({
        foo: 'bar'
      })

    const res3 = await request(server).delete(`/groups/${group.id}`)

    const group2 = res3.body.pkg

    expect(group2.deleted).to.be.true

  })

})
