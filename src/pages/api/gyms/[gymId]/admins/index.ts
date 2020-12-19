import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const GET = async (gymId: number, email: string) => {
    try {
        const gym = await prisma.gym.findUnique({
            where: {
                id: gymId,
            },
            select: {
                gymAdmins: true,
            },
        })

        const isAdmin = !!(gym.gymAdmins.filter((user) => user.email === email).length === 1)

        return isAdmin
    } catch {
        return { error: 'Could not get admins' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    switch (req.method) {
        case 'GET':
            return res.json(await GET(Number(req.query.gymId), session.user.email))
            break
        default:
            res.status(405).end()
            break
    }
}
