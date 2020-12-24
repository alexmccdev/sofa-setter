import Link from 'next/link'
import Loading from '@components/shared/Loading'
import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useSWR from 'swr'
import { GET as GetGym } from '@api/gyms/[gymId]'
import { GET as GetProblems } from '@api/gyms/[gymId]/problems'
import { GetServerSideProps } from 'next'
import { Gym, Problem } from '@prisma/client'
import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'

dayjs.extend(relativeTime)

interface ProblemsPageProps {
    gym: Gym
    problems: Problem[]
}

const ProblemsPage: React.FC<ProblemsPageProps> = (props) => {
    const router = useRouter()

    const { data: gym } = useSWR(`/api/gyms/${router.query.gymId}`, { initialData: props.gym })
    const { data: problems } = useSWR(`/api/gyms/${router.query.gymId}/problems`, { initialData: props.problems })

    if (!gym || !problems) return <Loading />

    return (
        <>
            <div className="mb-4">
                <h1>{gym.name}</h1>
                <h2 className="font-light">{gym.location}</h2>
            </div>
            <div className="flex flex-col">
                {problems
                    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) // initially sort by created date
                    .map((p: Problem) => {
                        return <ProblemCard problem={p} key={p.id} />
                    })}
            </div>
        </>
    )
}

interface ProblemCardProps {
    problem: Problem
}
const ProblemCard: React.FC<ProblemCardProps> = (props) => {
    const { problem } = props
    return (
        <Link href={`/gyms/${problem.gymId}/problems/${problem.id}`}>
            <div key={problem.id} className="mb-4 card hover:cursor-pointer">
                <h1>{problem.name}</h1>
                <h2 className="font-light">{problem.grade}</h2>
                <p>Set {dayjs(problem.createdAt).fromNow()}</p>
            </div>
        </Link>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: { permanent: false, destination: '/login' },
        }
    }

    const gymId = Number(context.query.gymId)
    const gym = await GetGym(gymId)
    const problems = await GetProblems({ gymId })

    return {
        props: {
            gym: JSON.parse(JSON.stringify(gym)),
            problems: JSON.parse(JSON.stringify(problems)),
        },
    }
}

export default ProblemsPage
