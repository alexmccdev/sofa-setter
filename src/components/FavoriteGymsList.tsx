import React from 'react'
import { Gym } from '@prisma/client'

interface FavoriteGymsListProps {
    gyms: Gym[]
}

const FavoriteGymsList: React.FC<FavoriteGymsListProps> = (props) => {
    return (
        <div className="flex flex-col">
            {props.gyms.map((g: Gym) => {
                return (
                    <div key={g.id} className="mb-4 card">
                        <h1>Name: {g.name}</h1>
                        <h2>Location: {g.location}</h2>
                        <h3>ID: {g.id}</h3>
                    </div>
                )
            })}
        </div>
    )
}

export default FavoriteGymsList
