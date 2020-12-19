import type { NextApiRequest, NextApiResponse } from 'next'
import { Gym, PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const GET = async () => {
    try {
        return await prisma.gym.findMany()
    } catch {
        return { error: 'Could not get gyms.' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    switch (req.method) {
        // Gets ALL gyms
        case 'GET':
            res.json(await GET())
            break

        // Creates a gym
        case 'POST':
            try {
                const newGym = await prisma.gym.create({
                    data: req.body,
                })
                res.json(newGym)
            } catch {
                res.json({ error: 'Could not create gym.' })
            }

            break

        default:
            res.status(405).end()
            break
    }
}
