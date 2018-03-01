import mongoose from 'mongoose'

const UsersSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
})
mongoose.model('Users', UsersSchema)

export default mongoose.model('Users')
