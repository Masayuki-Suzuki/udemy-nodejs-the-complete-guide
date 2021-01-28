import { RequestWithUserModel } from '../types/express'

export default function (val: unknown): asserts val is RequestWithUserModel {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!('user' in val && 'body' in val)) {
        throw new Error('Nope!!')
    }
}
