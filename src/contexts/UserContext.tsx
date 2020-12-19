import React, { useContext } from 'react'
import useSWR from 'swr'

const UserContext = React.createContext(null)

const UserProvider = (props) => {
    const { data: user } = useSWR('/api/user')
    return <UserContext.Provider value={{ user }} {...props} />
}

const useUser = () => {
    return useContext(UserContext)
}

export { UserProvider, useUser }
