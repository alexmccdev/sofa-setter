import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { v2 as cloudinary } from 'cloudinary'

const POST = (eager: string) => {
    const timestamp = Math.round(new Date().getTime() / 1000)

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            eager,
        },
        process.env.CLOUDINARY_SECRET,
    )

    return { signature, timestamp, eager }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).end()
    }

    switch (req.method) {
        case 'POST':
            return res.json(POST(req.body.eager))

        default:
            res.status(405).end()
            break
    }
}
