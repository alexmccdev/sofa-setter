import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Prisma } from '@prisma/client'
import { getSession } from 'next-auth/client'

const prisma = new PrismaClient()

export const GET = async (filter: Prisma.ProblemScalarWhereInput) => {
    try {
        return await prisma.problem.findMany({
            where: { gymId: Number(filter.gymId) },
        })
    } catch (err) {
        return { error: err }
    }
}

export const POST = async (email: string, gymId: number, newProblem: Prisma.ProblemCreateInput) => {
    try {
        const problem = await prisma.problem.create({
            data: {
                ...newProblem,
                gym: {
                    connect: { id: gymId },
                },
                user: {
                    connect: { email },
                },
            },
        })

        return problem
    } catch {
        return { error: 'Something went wrong while creating a problem.' }
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    switch (req.method) {
        case 'GET':
            res.json(await GET(req.query as Prisma.ProblemScalarWhereInput))
            break
        case 'POST':
            res.json(await POST(session.user.email, Number(req.query.gymId), req.body))
            break
        default:
            res.status(405).end()
            break
    }
}
