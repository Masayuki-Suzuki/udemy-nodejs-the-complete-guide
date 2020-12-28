import { Request, Response } from 'express'

export const getDashboardPage = (req: Request, res: Response): void => {
    res.render('./admin/dashboard', {
        title: 'Admin Dashboard',
        path: 'dashboard',
        pageTitle: 'Dashboard'
    })
}

export const redirectToDashboard = (req: Request, res: Response): void => {
    res.redirect('/admin/dashboard')
}

export default {
    getDashboardPage,
    redirectToDashboard
}
