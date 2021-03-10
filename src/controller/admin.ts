import { format } from 'date-fns'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { DocumentUser, UserType, UserWithCart } from 'src/types/models'
import User from '../models/user'
import { Nullable } from '../types/utilities'

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
    const usersData = (await User.find({
        isDeleted: { $ne: true }
    })) as DocumentUser[]

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

export const getEditUserPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    let title = 'Add New User'
    let path = 'add-new-user'
    let pageTitle = 'Add New Admin User'
    let user: Nullable<UserWithCart> = null
    const editMode = req.query.edit === 'true'

    if (editMode) {
        title = 'Edit User'
        path = 'edit-admin-user'
        pageTitle = 'Edit User'

        const userData = (await User.findOne({
            _id: req.params.id
        }).catch(err => console.error(err))) as UserWithCart

        user = userData
    }

    res.render('admin/edit-user', {
        title,
        path,
        pageTitle,
        user,
        editMode
    })
}

export const redirectToDashboard = (req: Request, res: Response): void => {
    res.redirect('admin/dashboard')
}

export default {
    getDashboardPage,
    getUsersPage,
    getEditUserPage,
    redirectToDashboard
}
