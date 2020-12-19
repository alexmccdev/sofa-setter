import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const GET = async (id: number) => {
    try {
        const gym = await prisma.gym.findUnique({
            where: {
                id,
            },
        })
        return gym
    } catch {
        return { error: 'Could not get gym.' }
    }
}

export const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    try {
        const deleteGym = await prisma.gym.delete({
            where: {
                id: Number(req.query.gymId),
            },
        })
        res.json(deleteGym)
    } catch {
        res.json({ error: 'Could not delete gym.' })
    }
}

export const PATCH = async (gymId: number, email: string, gymUpdates: Prisma.GymUpdateInput) => {
    try {
        const updateGym = await prisma.gym.update({
            where: {
                id: gymId,
            },
            include: {
                gymAdmins: {
                    where: {
                        email,
                    },
                },
            },
            data: gymUpdates,
        })
        return updateGym
    } catch {
        return { error: 'Could not update gym.' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    switch (req.method) {
        // Gets a gym
        case 'GET':
            return res.json(await GET(Number(req.query.gymId)))
        // Deletes a gym
        case 'DELETE':
            DELETE(req, res)
            break
        // Updates a gym
        case 'PATCH':
            return res.json(await PATCH(Number(req.query.gymId), session.user.email, req.body))
        default:
            res.status(405).end()
            break
    }
}
