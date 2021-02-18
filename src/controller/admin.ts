import { format } from 'date-fns'
import { Request, Response } from 'express'
import { DocumentUser, UserType, UserTypeForViews } from 'src/types/models'
import User from '../models/user'

export const getDashboardPage = (req: Request, res: Response): void => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        path: 'dashboard',
        pageTitle: 'Dashboard'
    })
}

export const getUsersPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const usersData = (await User.find()) as DocumentUser[]

    const users = usersData.map(user => {
        if (
            user._doc &&
            'lastLoggedIn' in user._doc &&
            user._doc.lastLoggedIn
        ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return {
                ...user._doc,
                lastLoggedIn: format(
                    new Date(user._doc.lastLoggedIn),
                    'MMMM dd, yyyy'
                )
            }
        }
        return user._doc as UserType
    })

    res.render('admin/users', {
        title: 'Users',
        path: 'admin-users',
        pageTitle: 'Users',
        users: users || []
    })
}

export const getAddNewUserPage = (req: Request, res: Response): void => {
    res.render('admin/edit-user', {
        title: 'Add New User',
        path: 'add-new-user',
        pageTitle: 'Add New Admin User',
        password: null,
        user: null,
        editMode: false
    })
}

export const redirectToDashboard = (req: Request, res: Response): void => {
    res.redirect('admin/dashboard')
}

export default {
    getDashboardPage,
    getUsersPage,
    getAddNewUserPage,
    redirectToDashboard
}
