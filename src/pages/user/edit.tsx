import ProfileImageUpload from '@components/ProfileImageUpload'
import React, { useState } from 'react'
import axios from 'axios'
import useSWR, { trigger } from 'swr'
import useToast from '@hooks/useToast'
import { GET as GetUser } from '@api/user'
import { GetServerSideProps } from 'next'
import { Prisma, User } from '@prisma/client'
import { getSession, signOut } from 'next-auth/client'
import { useForm } from 'react-hook-form'

interface UserEditPageProps {
    user: User
}

const UserEdit: React.FC<UserEditPageProps> = (props) => {
    const { data: user, mutate } = useSWR('/api/user', { initialData: props.user })
    const { register, handleSubmit, errors } = useForm()
    const { showError, showSuccess } = useToast()
    const [userImageUrl, setUserImageUrl] = useState(props.user.image)

    const handleUpdateUser = async (userUpdates: Prisma.UserUpdateInput) => {
        mutate({ ...user, ...userUpdates, image: userImageUrl } as User, false)

        const { data } = await axios.patch('/api/user', { ...userUpdates })

        if (!data.error) {
            showSuccess('User updated')
        } else {
            showError(data.error)
        }

        trigger('/api/user')
    }

    const handleProfileImageUpdate = async (imageUrl: string) => {
        setUserImageUrl(imageUrl)
        mutate((user: User) => {
            return { ...user, image: imageUrl }
        }, false)

        const { data } = await axios.patch('/api/user', { image: imageUrl })

        if (!data.error) {
            showSuccess('Profile picture updated!')
        } else {
            showError(data.error)
        }

        trigger('/api/user')
    }

    return (
        <div className="flex">
            <form className="flex flex-col w-2/3 pr-6" onSubmit={handleSubmit(handleUpdateUser)}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" defaultValue={user.email} disabled />
                {errors.email && <span>This field is required</span>}
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" defaultValue={user.name} ref={register()} />
                <button className="mb-20 btn" type="submit">
                    Update
                </button>
                <button
                    className="text-white btn bg-error"
                    onClick={(e) => {
                        e.preventDefault()
                        signOut()
                    }}
                >
                    Logout
                </button>
            </form>
            <div className="w-1/3">
                <label htmlFor="profilePicture">Profile picture</label>
                <ProfileImageUpload
                    inputId="profilePicture"
                    inputName="profilePicture"
                    handleProfileImageUpdate={handleProfileImageUpdate}
                    userImageUrl={userImageUrl}
                />
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: { permanent: false, destination: '/login' },
        }
    }

    const user = await GetUser(session.user.email)

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
        },
    }
}

export default UserEdit
