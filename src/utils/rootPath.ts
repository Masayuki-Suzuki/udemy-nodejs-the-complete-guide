import path from 'path'

export const srcPath: string = ((): string => {
    if (process.mainModule && process.mainModule.filename) {
        return path.dirname(process.mainModule.filename)
    }
    return ''
})()

export const rootPath: string = ((): string => {
    return path.join(srcPath, '..')
})()
