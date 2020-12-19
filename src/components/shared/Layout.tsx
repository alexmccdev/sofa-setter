import React from 'react'

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = (props) => {
    return <main className="w-full mx-auto max-w-3xl p-4 flex flex-col flex-grow">{props.children}</main>
}

export default Layout
