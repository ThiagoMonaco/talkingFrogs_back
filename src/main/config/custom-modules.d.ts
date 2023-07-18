declare namespace Express {
    interface Request {
        accountId?: string
        accountEmail?: string
        accountName?: string
        isEmailVerified?: boolean
    }
}