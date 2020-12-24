import React from 'react'
import { signIn } from 'next-auth/client'
import { useForm } from 'react-hook-form'

const LoginForm = () => {
    const { register, handleSubmit, errors } = useForm()

    const onSubmit = async (loginData: { email: string }) => {
        await signIn('email', { ...loginData, callbackUrl: '/' })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className="mb-4">Login</h2>
            <label htmlFor="email" className="flex flex-col font-semibold">
                Enter your email address to sign in or create an account
            </label>
            <input
                type="text"
                className="w-full"
                id="email"
                name="email"
                placeholder="test@gmails.com"
                ref={register({ required: true })}
            />
            {errors.email && <span className="text-error">Email is required</span>}
            <div className="flex">
                <button className="btn" type="submit">
                    Login
                </button>
            </div>
        </form>
    )
}

export default LoginForm
