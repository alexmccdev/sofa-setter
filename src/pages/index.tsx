import Link from 'next/link'
import React from 'react'
import useSWR from 'swr'
import { GET as GetGyms } from '@api/gyms'
import { GET as GetLikedGyms } from '@api/user/gyms'
import { GetServerSideProps } from 'next'
import { Gym } from '@prisma/client'
import { getSession } from 'next-auth/client'

/* 
    If a user enters the homepage with 1 favorite gym, just show the problems page
    If a user enters the homepage with more than 1 favorite, show gyms list
*/

interface HomePageProps {
    gyms: Gym[]
    likedGyms: Gym[]
}

const HomePage: React.FC<HomePageProps> = (props) => {
    const { data: gyms } = useSWR('/api/gyms', { initialData: props.gyms })

    return (
        <div className="flex flex-col">
            {gyms.map((g: Gym) => {
                return <GymCard gym={g} key={g.id} />
            })}
        </div>
    )
}

interface GymCardProps {
    gym: Gym
}

const GymCard: React.FC<GymCardProps> = (props) => {
    const { gym } = props
    return (
        <Link href={`/gyms/${gym.id}`}>
            <div key={gym.id} className="mb-4 card hover:cursor-pointer">
                <img
                    src={gym.image || `https://picsum.photos/seed/${gym.id}/736/300`}
                    className="object-cover w-full h-20 mb-4"
                />
                <h1>{gym.name}</h1>
                <h2 className="font-light">{gym.location}</h2>
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

    const gyms = await GetGyms()
    const likedGyms = await GetLikedGyms(session.user.email)

    return {
        props: {
            gyms: JSON.parse(JSON.stringify(gyms)),
            likedGyms: JSON.parse(JSON.stringify(likedGyms)),
        },
    }
}

export default HomePage
