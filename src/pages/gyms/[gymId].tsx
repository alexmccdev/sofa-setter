import GradeGraph from '@components/GradeGraph'
import Link from 'next/link'
import Loading from '@components/shared/Loading'
import React, { useState } from 'react'
import useSWR, { mutate, trigger } from 'swr'
import { GET as GetGym } from '@api/gyms/[gymId]'
import { GET as GetProblems } from '@api/gyms/[gymId]/problems'
import { GET as GetAdmins } from '@api/gyms/[gymId]/admins'
import { GetServerSideProps } from 'next'
import { Gym, Prisma, Problem } from '@prisma/client'
import { getSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import useToast from '@hooks/useToast'
import Tippy from '@tippyjs/react'

interface SingleGymPageProps {
    gym: Gym
    problems: Problem[]
    isAdmin: boolean
}

const SingleGym: React.FC<SingleGymPageProps> = (props) => {
    const router = useRouter()

    const getRoute = `/api/gyms/${router.query.gymId}`
    const { data: gym } = useSWR(getRoute, { initialData: props.gym })
    const { data: problems } = useSWR(getRoute + '/problems', { initialData: props.problems, revalidateOnMount: true }) // Revalidation is to get most up-to-date data
    const { data: isAdmin } = useSWR(getRoute + '/admins', { initialData: props.isAdmin })

    if (!gym || !problems) return <Loading />

    const { showError, showSuccess } = useToast()
    const [gymIsEditable, setGymIsEditable] = useState(false)
    const [gymImageIsEditable, setGymImageIsEditable] = useState(false)
    const {
        register,
        handleSubmit,
        errors,
        formState: { isDirty },
    } = useForm()

    const activeProblems = problems.filter((p: Problem) => {
        return p.active
    })

    const uniqueSetters = [...new Set(problems.map((p: Problem) => p.userId))]

    const handleGymUpdate = async (gymUpdates: Prisma.GymUpdateInput) => {
        if (!isDirty) {
            setGymIsEditable(false)
            return
        }

        mutate(
            getRoute,
            (data: Gym) => {
                return { ...data, ...gymUpdates }
            },
            false,
        )

        const { data } = await axios.patch(getRoute, gymUpdates)

        if (!data.error) {
            showSuccess('Gym info updated!')
        } else {
            showError(data.error)
        }

        trigger(getRoute)
        setGymIsEditable(false)
    }
    return (
        <>
            <div className="relative w-full">
                {isAdmin && (
                    <Tippy
                        content={
                            <div className="flex flex-col">
                                {'' !== `https://picsum.photos/seed/${gym.id}/736/300` && (
                                    <div
                                        role="button"
                                        className="p-2 cursor-pointer hover:bg-gray-200"
                                        onClick={() => {
                                            setGymImageIsEditable(false)
                                            // props.handleProfileImageUpdate(
                                            //     `https://picsum.photos/seed/${gym.id + 1}/736/300`,
                                            // )
                                        }}
                                    >
                                        🗑️ Revert to default
                                    </div>
                                )}
                                <div
                                    role="button"
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                        setGymImageIsEditable(false)
                                        open()
                                    }}
                                >
                                    🖼️ Upload a picture
                                </div>
                            </div>
                        }
                        theme="default"
                        visible={gymImageIsEditable}
                        onClickOutside={() => setGymImageIsEditable(false)}
                        animation={false}
                        placement="bottom-end"
                        interactive={true}
                        arrow={false}
                    >
                        <button
                            className="absolute bg-white btn right-2 top-2 btn-sm"
                            onClick={() => setGymImageIsEditable((prev) => !prev)}
                        >
                            ✏️ Update Image
                        </button>
                    </Tippy>
                )}

                <img
                    src={gym.image || `https://picsum.photos/seed/${gym.id}/736/300`}
                    className="object-cover w-full h-48 mb-4"
                />
            </div>
            <div className="mb-4">
                <div className="flex justify-between">
                    {gymIsEditable ? (
                        <form className="flex justify-between w-full" onSubmit={handleSubmit(handleGymUpdate)}>
                            <div className="flex flex-col">
                                <input
                                    type="text"
                                    className="text-3xl font-bold"
                                    name="name"
                                    ref={register({ required: true })}
                                    placeholder="Name"
                                    defaultValue={gym.name}
                                />
                                {errors.name && <p className="text-error">Name is required</p>}
                                <input
                                    type="text"
                                    className="text-xl font-light"
                                    name="location"
                                    ref={register({ required: true })}
                                    placeholder="Location"
                                    defaultValue={gym.location}
                                />
                                {errors.location && <p className="text-error">Location is required</p>}{' '}
                                <textarea
                                    name="description"
                                    rows={5}
                                    ref={register()}
                                    placeholder="Short description..."
                                    defaultValue={gym.description}
                                />
                            </div>
                            <div>
                                <button type="submit" className="align-top">
                                    💾 Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex flex-col">
                            <h1>{gym.name}</h1>
                            <h2 className="font-light">{gym.location}</h2>
                            {gym.description && <p className="mt-4">{gym.description}</p>}
                        </div>
                    )}
                    {isAdmin && !gymIsEditable && (
                        <div>
                            <button
                                type="submit"
                                className="p-2 align-top whitespace-nowrap"
                                onClick={() => setGymIsEditable(true)}
                            >
                                ✏️ Edit Info
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-4 mb-4 sm:grid-cols-3 min-h-48">
                <Link href={`/gyms/${gym.id}/problems`}>
                    <div className="flex flex-col card min-w-48 hover:cursor-pointer">
                        <h3 className="text-center">Active problems</h3>
                        <p className="my-auto text-6xl font-bold text-center">{activeProblems.length}</p>
                    </div>
                </Link>
                <div className="flex flex-col card min-w-48">
                    <h3 className="text-center">Sofa setters</h3>
                    <p className="my-auto text-6xl font-bold text-center">{uniqueSetters.length}</p>
                </div>
                <div className="flex flex-col card min-w-48">
                    <h3 className="text-center">Another stat</h3>
                    <p className="my-auto text-6xl font-bold text-center">{Math.floor(Math.random() * 100)}</p>
                </div>
            </div>
            <div className="flex h-64">
                <div className="flex flex-col w-full card">
                    <h3>Grade Graph</h3>
                    <GradeGraph problems={activeProblems} color={gym.theme || 'green'} />
                </div>
            </div>
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
    const problems = await GetProblems(gymId)
    const isAdmin = await GetAdmins(gymId, session.user.email)
    return {
        props: {
            gym: JSON.parse(JSON.stringify(gym)),
            problems: JSON.parse(JSON.stringify(problems)),
            isAdmin: JSON.parse(JSON.stringify(isAdmin)),
        },
    }
}

export default SingleGym
