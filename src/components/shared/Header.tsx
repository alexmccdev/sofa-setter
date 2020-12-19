import Link from 'next/link'
import React from 'react'
import router from 'next/router'
import { useUser } from '@contexts/UserContext'

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const { user } = useUser()

    if (!user) {
        return (
            <header>
                <SiteLogo />
            </header>
        )
    }

    return (
        <header>
            <SiteLogo />
            <div className="flex items-center">
                {user ? (
                    <LoggedInUser email={user.email} image={user.image} />
                ) : (
                    <button className="btn" onClick={() => router.push('/login')}>
                        Login
                    </button>
                )}
            </div>
        </header>
    )
}

const SiteLogo: React.FC = () => {
    return (
        <Link href="/">
            <a className="flex h-full">
                <h1 className="self-center" title="Couch Setter">
                    Sofa Setter
                </h1>
            </a>
        </Link>
    )
}

interface LoggedInUserProps {
    email: string
    image?: string
}

const LoggedInUser: React.FC<LoggedInUserProps> = (props) => {
    return (
        <div className="items-center hidden cursor-pointer sm:flex sm:visible">
            <Link href="/user/edit">
                <img
                    role="button"
                    className="w-10 h-10 rounded-full"
                    src={props.image || '/default_profile_picture.jpg'}
                />
            </Link>
        </div>
    )
}

export default Header
