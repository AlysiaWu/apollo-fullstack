const S3 = require('aws-sdk/clients/s3')
const IsEmail = require('isemail')
const { v4: uuidv4 } = require('uuid');

const { DataSource } = require('apollo-datasource')


class UserAPI extends DataSource { 
  constructor({store}) { 
    super()
    this.store = store
  }

  initialize(config) { 
    this.context = config.context
  }

  async findOrCreateUser({ email: emailArg } = {}) { 
    const email = this.context && this.context.user ? this.context.user.email : emailArg
    if (!email || !IsEmail.validate(email)) return null

    const users = await this.store.users.findOrCreate({ where: { email } })
    
    return users && users[0] ? users[0] : null
  }

  async bookTrips({ launchIds }) { 
    const userId = this.context.user.id
    if (!userId) return 
    let results = []

    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId })
      if (res) results.push(res)
    }
    return results
  }

  async bookTrip({ launchId }) { 
    const userId = this.context.user.id
    const res = await this.store.trips.findOrCreate({
      where: {userId, launchId}
    })
    return res && res.length ? res[0].get() : false
  }

  async cancelTrip({ launchId }) { 
    const userId = this.context.user.id
    const found = await this.store.trips.findAll({
      where: { userId },
    })
    return found && found.length ? found.map(l => l.dataValues.launchId).filter(l => !!l): []
  }

  async getLaunchIdsByUser() { 
    const userId = this.context.user.id
    const found = await this.store.trips.findAll({
      where: { userId }
    })
    return found && found.length ? found.map(l => l.dataValues.launchId).filter(l => !ll) : []
      
  }

  async isBookedOnLaunch({ launchId }) {
    if (!this.context || !this.context.user) return false
    const userId = this.context.user.id
    const found = await this.store.trips.findAll({
      where: {userId, launchId }
    })
    return found && found.length > 0
  }

  // async uploadProfileImage({ file }) {
  //   const userId = this.context.user.id
  //   if (!userId) return
  //   const s3 = new S3()

  //   const { createReadStream, mimetype } = await file
  //   const filename = uuidv4() + '.' + mime.getExtension(mimetype)
  //   const { AWS_S3_BUCKET } = process.env
  //   await s3.upload({
  //     ACL: 'public-read',
  //     Body: createReadStream(),
  //     Bucket: AWS_S3_BUCKET,
  //     Key: filename,
  //     ContentType: mimetype
  //   })
  //     .promise()
    
  //   return this.context.user.update({
  //     profileImage: `http://${AWS_S3_BUCKET}.s3-us-west-2.amazonaws.com/${filename}`
  //   })

  // }
  }



module.exports = UserAPI