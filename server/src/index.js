require('dotenv').config()

const { ApolloServer } = require('apollo-server')
const isEmail = require('isemail')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { createStore } = require('./utils')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')
const store = createStore()


const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store })
})

const context = async ({ req}) => { 
  const auth = (req.headers && req.headers.authorization) || ''
  const email = Buffer.from(auth, 'base64').toString('ascii')

  if (!isEmail.validate(email)) return { user: null }
  const users = await store.users.findOrCreate({ where: { email } })
  const user = users && users[0] ? users[0] : null
  return {user}
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  introspection: true,
  playground: true,

})


server.listen().then(() => {
  console.log(`
  Server is running at 4000
  Query at https://studio.apollographql.com/dev
  `)
})

module.exports = {
  dataSources,
  server,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  LaunchAPI,
  UserAPI,
  store,
}