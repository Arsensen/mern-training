const { Router } = require("express")

const router = Router()

router.get('/', (req, res)=>{
    res.end('I am alive')
})

module.exports = router