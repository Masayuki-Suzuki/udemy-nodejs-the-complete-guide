import path from 'path'

export const rootPath: string = ((): string => {
    if (process.mainModule && process.mainModule.filename) {
        return path.dirname(process.mainModule.filename)
    }
    return ''
})()
