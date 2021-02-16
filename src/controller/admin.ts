import { Request, Response } from 'express'
import { UserType } from 'src/types/models'
import User from '../models/user'

export const getDashboardPage = (req: Request, res: Response): void => {
    res.render('./admin/dashboard', {
        title: 'Admin Dashboard',
        path: 'dashboard',
        pageTitle: 'Dashboard'
    })
}

export const getUsersPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const users = (await User.find()) as UserType[]

    res.render('./admin/users', {
        title: 'Admin Users',
        path: 'admin-users',
        pageTitle: 'Admin Users',
        users: users || []
    })
}

export const redirectToDashboard = (req: Request, res: Response): void => {
    res.redirect('/admin/dashboard')
}

export default {
    getDashboardPage,
    getUsersPage,
    redirectToDashboard
}
