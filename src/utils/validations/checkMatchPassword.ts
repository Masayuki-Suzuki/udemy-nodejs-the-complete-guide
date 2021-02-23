import { check, body } from 'express-validator/check'
import { Request } from 'express'

export default body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Password does not match.')
    }
    return true
})
