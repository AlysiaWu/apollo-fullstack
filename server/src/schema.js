const { gql } = require('apollo-server')


const typeDefs = gql`

  type Query {
    launches(
      pageSize: Int
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchID: ID!): TripUpdateResponse!
    login(email: String): User
    uploadProfileImage(file: Upload!): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launch: [Launch]
  }

  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String  
  }

  type User {
    id: ID!
    email: String
    profileImage: String
    trips: [Launch]!
    token: String
  }
  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`

module.exports = typeDefs