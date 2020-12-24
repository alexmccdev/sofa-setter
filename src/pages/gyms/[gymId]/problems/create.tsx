import Loading from '@components/shared/Loading'
import React from 'react'
import axios from 'axios'
import useSWR from 'swr'
import useToast from '@hooks/useToast'
import { GET as GetGym } from '@api/gyms/[gymId]'
import { GetServerSideProps } from 'next'
import { Prisma, Gym } from '@prisma/client'
import { getSession } from 'next-auth/client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

interface CreateProblemPageProps {
    gym: Gym
}

const CreateProblemPage: React.FC<CreateProblemPageProps> = (props) => {
    const router = useRouter()
    const { showSuccess, showError } = useToast()

    const { data: gym } = useSWR(`/api/gyms/${router.query.gymId}`, { initialData: props.gym })

    if (!gym) return <Loading />

    const { register, handleSubmit, errors, formState, reset } = useForm()

    const handleCreateProblem = async (newProblem: Prisma.ProblemCreateInput) => {
        const { data } = await axios.post(`/api/gyms/${gym.id}/problems`, { ...newProblem, image: '' })

        if (!data.error) {
            router.push({ pathname: '/gyms/[gymId]', query: { gymId: gym.id } })
            showSuccess('Problem created!')
        } else {
            showError(data.error)
            reset()
        }
    }

    const grades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14']

    return (
        <>
            <div className="mb-4">
                <h1>{gym.name}</h1>
                <h2 className="font-light">{gym.location}</h2>
                {gym.description && <p className="mt-4">{gym.description}</p>}
            </div>
            <form className="flex flex-col w-2/3 pr-6" onSubmit={handleSubmit(handleCreateProblem)}>
                <label htmlFor="name">Problem Name</label>
                <input type="text" id="name" name="name" ref={register({ required: true })} />
                {errors.name && <p className="text-error">This field is required</p>}
                <label htmlFor="grade">Grade</label>
                <select id="grade" name="grade" ref={register({ required: true })}>
                    {grades.map((g, i) => {
                        return (
                            <option key={i} value={g}>
                                {g}
                            </option>
                        )
                    })}
                </select>
                {errors.grade && <p className="text-error">This field is required</p>}
                <button className="mb-20 btn" type="submit" disabled={formState.isSubmitting}>
                    {formState.isSubmitted ? 'Submitting...' : 'Update'}
                </button>
            </form>
        </>
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

    return {
        props: {
            gym: JSON.parse(JSON.stringify(gym)),
        },
    }
}

export default CreateProblemPage
