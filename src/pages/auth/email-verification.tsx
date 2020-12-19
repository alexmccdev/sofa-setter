import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import React from 'react'

const VerifyEmail = () => {
    return (
        <>
            <h2 className="mb-4">Check Email</h2>
            <p>Please check your email inbox and click on the provided link to verify your account.</p>
            <Link href="/login">Back to Login</Link>
        </>
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

export default VerifyEmail
