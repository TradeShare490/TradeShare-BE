import mongoose from 'mongoose'

async function connect () {
	const DB_URI = process.env.DB_URI
	if (!DB_URI) {
		console.log('ERROR: DB_URI not found. Please check if mongodb url exists in your .env file')
		process.exit(-1)
	}
	console.log('Connecting MongoDB ...')
	return await mongoose
		.connect(DB_URI)
		.then(() => {
			console.log('MongoDB Database connected')
		})
		.catch((error) => {
			console.log('DB error', error)
		})
}

async function disconnect () {
	console.log('MongoDB is closing..')
	await mongoose.disconnect()
	console.log('MongoDB has been closed')
}

const mongoInstance = {
	connect: connect,
	disconnect: disconnect
}

export default mongoInstance
