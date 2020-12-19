import LoginForm from '@components/LoginForm'
import React from 'react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'

const Login = () => {
    return (
        <div>
            <LoginForm />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    if (session) {
        return {
            redirect: { permanent: false, destination: '/' },
        }
    }

    return {
        props: {},
    }
}

export default Login
