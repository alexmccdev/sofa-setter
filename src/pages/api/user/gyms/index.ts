import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const GET = async (email: string) => {
    try {
        const { gyms } = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                gyms: true,
            },
        })
        return gyms
    } catch {
        return { error: 'Something went wrong.' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    switch (req.method) {
        // Gets all user liked gyms
        case 'GET':
            res.json(await GET(session.user.email))
            break

        default:
            res.status(405).end()
            break
    }
}
