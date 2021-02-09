import { CustomRequest } from '../types/express'
import { Nullable } from '../types/utilities'

export default (req: CustomRequest): Nullable<string[]> => {
    const errorMessage = req.flash('error') as Nullable<string[]>

    if (!errorMessage || !errorMessage.length) {
        return null
    }

    return errorMessage
}
