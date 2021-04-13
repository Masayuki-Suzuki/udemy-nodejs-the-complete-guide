import fs from 'fs'

export const deleteFile = (filePath: string) => {
    fs.unlink(`src/public${filePath}`, err => {
        if (err) {
            console.error(err)
            throw err
        }
    })
}
