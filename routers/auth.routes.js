const { Router } = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')

const router = Router()

router.post(
    '/register', 
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Password length is incorrcet').isLength({min: 8})
    ],
    async (req, res)=>{
    try {
        if(!validationResult(req).isEmpty()) return res.status(400).json({errors: validationResult(req).array(), message: 'Wrong data'}) 
        const { email, password } = req.body
        const candidate = await User.findOne({email})
        candidate && res.end('Your email had already registred')
        const hashedPassword = await bcrypt.hash(password, 11)
        const user = new User({email, password: hashedPassword}) // ??????
        await user.save()
        res.status(201).json('User was created')
    } catch (error) {
        res.status(500).json({message: 'Something wrong with the server registration. Try again later... Error: ' + error.message})
    }
})

router.post(
    '/login', 
    [
        check('email', 'Wrong email').normalizeEmail().isEmail(),
        check('password', 'Wrong password').exists()
    ],
    async (req, res)=>{
    try{
        if(!validationResult(req).isEmpty()) return res.status(400).json({errors: validationResult(req).array(), message: 'Wrong data'})
        const {email, password} = req.body
        const user = await User.findOne({ email })
        if(!user) return res.end('There are nobody with such name')
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message: 'Wrong user or password'})
        const token = jwt.sign(
            {userID: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
            )
        res.json({ token, userID: user.id })
    }catch(error){
        res.status(500).json({message: 'Something wrong with the server login. Try again later... Error: ' + error.message})
    }
})

router.get('/login', (req, res)=>{
    res.end('I am login')
})


module.exports = router

/* 
router.get()

router.post() */