import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let emailProviderOptions = {
    server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    },
    from: process.env.EMAIL_FROM,
}

// Console log the email links if not in production
if (process.env.NODE_ENV !== 'production') {
    emailProviderOptions.sendVerificationRequest = ({ identifier: email, url }) => {
        console.log('\x1b[32m%s\x1b[0m', `Magic Link for ${email}:`)
        console.log('\x1b[32m%s\x1b[0m', url)
    }
}

const options = {
    providers: [Providers.Email(emailProviderOptions)],
    secret: process.env.SECRET,
    pages: {
        signIn: '/login', // Displays signin buttons
        // signOut: '/api/auth/signout', // Displays form with sign out button
        // error: '/api/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/email-verification', // Used for check email page
        // newUser: null, // If set, new users will be directed here on first sign in
    },
    debug: process.env.NODE_ENV !== 'production',
    adapter: Adapters.Prisma.Adapter({
        prisma,
    }),
}

export default (req, res) => NextAuth(req, res, options)
