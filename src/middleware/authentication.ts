export const authenticated = (req, res, next): void => {
    if (!req.session.isLoggedIn) {
        res.status(401).redirect('/login')
    }
    next()
}

export const isAdminUser = (req, res, next): void => {
    const { isLoggedIn, user } = req.session

    if (!isLoggedIn || !user) {
        res.status(401).redirect('/login')
    } else if (user && !(user.role === 'admin' || user.role === 'root')) {
        res.status(401).redirect('/')
    } else {
        next()
    }
}
