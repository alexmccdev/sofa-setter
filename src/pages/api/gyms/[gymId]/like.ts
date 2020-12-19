import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const POST = async (email: string, id: number) => {
    try {
        const likedGym = await prisma.gym.findUnique({
            where: {
                id,
            },
        })

        await prisma.user.update({
            where: {
                email,
            },
            data: {
                gyms: {
                    connect: {
                        id,
                    },
                },
            },
        })

        return likedGym
    } catch {
        return { error: 'Something went wrong while liking a gym.' }
    }
}

export const DELETE = async (email: string, id: number) => {
    try {
        const unlikedGym = await prisma.gym.findUnique({
            where: {
                id,
            },
        })

        await prisma.user.update({
            where: {
                email,
            },
            data: {
                gyms: {
                    disconnect: {
                        id,
                    },
                },
            },
        })

        return unlikedGym
    } catch {
        return { error: 'Something went wrong while unliking a gym.' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    switch (req.method) {
        // Likes a gym
        case 'POST':
            res.json(await POST(session.user.email, Number(req.query.id)))
            break

        // Unfavorites a gym
        case 'DELETE':
            res.json(await DELETE(session.user.email, Number(req.query.id)))
            break

        default:
            res.status(405).end()
            break
    }
}
