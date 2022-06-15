const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lhdjj.mongodb.net/test",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 4000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Hello World')
})

app.get('/hello', (req, res) => {
	res.send('Hello and welcome')
})

app.get('/', (req, res) => {
	res.send('Diena server')
})

app.post('/login', async (req, res) => {
	//console.log(req.body);

	const user = await User.login(req.body.userName, req.body.userpassword);
	if(user=="The Username is invalid"||user=="The Password is invalid"||user=="The Email id is invalid"){
		return res.status(404).send("Wrong login details")
	}
	return res.status(200).send("login success")
})

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               username: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         username: 
 *           type: string
 *         phone: 
 *           type: string
 */

/**
 * @swagger
 * /visitor/{id}:
 *   get:
 *     description: Get visitor by id
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: visitor id
 */

app.post('/register', async (req, res) => {
	//console.log(req.body);
	const user = await User.register(req.body.userName, req.body.UserEmail,req.body.userpassword,req.body.encryptedPassword);
	if(user=="The username already exist!"){
		return res.status(404).send("The username already exist!")
	}
	return res.status(200).send("New user is created")
	
})
app.delete('/delete', async (req, res) => {
	//console.log(req.body);
	const user = await User.delete(req.body.userName, req.body.UserEmail,req.body.userpassword);//,req.body.encryptedPassword);
	if(user=="The Username is invalid"||user=="The Password is invalid"||user=="The Email id is invalid"){
		return res.status(404).send("The information is invalid")
	}
	return res.status(200).send("The information is delete successfully")
	
})
app.patch('/update', async (req, res) => {
	const user = await User.update(req.body.userName);
	if (user == "The username is wrong"){
		return res.status(404).send("The update is failed")
	}
	return res.status(200).send("The username is updated!")
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})