const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const Links = require('../models/Links')
const linkAuth = require('../middleware/link.middleware')
const shortID = require('shortid')
const config = require('config')

const router = Router()

router.post('/generate', 
    linkAuth,
    [
        check('link', 'Invalid url').isURL()
    ],
    async (req, res)=>{
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()) return res.status(400).json({errors: errors.array(), message: 'Wrong data'})
            const from = req.body.link
            const code = await shortID.generate()
            const checker = await Links.findOne({from})
            if(checker) return res.json('Link have already been created')
            const baseURL = config.get("baseURL")
            const to = baseURL + '/to/' + code
            const link = await new Links({
                from, to, owner: req.user.userID
            })
            await link.save()
            res.status(201).json({link})
        }catch(e){
            console.log(e + "ERRRORRRR")
            res.status(500).json({message: 'Something wrong with the server registration. Try again later... Error: ' + e.message})
        }        
    }
)

router.get('/', linkAuth, async(req, res)=>{
    try {
        const link = await Links.find({owner: req.user.userID})
        res.json(link)
    } catch (e) {
        res.status(500).json({message: 'Something wrong with the server registration. Try again later... Error: ' + error.message})
    }
})

router.get('/:id', linkAuth, async(req, res)=>{
    try {
        const link = await Links.findById(req.params.id)
        res.json(link)
    } catch (e) {
        res.status(500).json({message: 'Something wrong with the server registration. Try again later... Error: ' + error.message})
    }    
})

module.exports = router