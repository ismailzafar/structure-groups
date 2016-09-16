import express from 'express'
import request from 'supertest-as-promised'

function MockHTTPServer(options = {}) {

  const server = express()

  return request(server)
}

export default MockHTTPServer
