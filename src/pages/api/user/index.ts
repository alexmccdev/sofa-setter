import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const GET = async (email: string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                email: true,
                name: true,
                image: true,
                roles: {
                    select: {
                        name: true,
                    },
                },
            },
        })
    } catch {
        return { error: 'Something went wrong.' }
    }
}

export const PATCH = async (email: string, data: Prisma.UserUpdateInput) => {
    try {
        return await prisma.user.update({
            where: {
                email,
            },
            data,
        })
    } catch {
        return { error: 'Something went wrong.' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        return res.json(null)
    }

    switch (req.method) {
        case 'GET':
            return res.json(await GET(session.user.email))

        case 'PATCH':
            return res.json(await PATCH(session.user.email, req.body))
            break

        default:
            res.status(405).end()
            break
    }
}
