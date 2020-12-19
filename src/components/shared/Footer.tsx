import React from 'react'

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="h-10 flex flex-none justify-center px-4 border-t">
            <p className="self-center">Alex McConnell 2020</p>
        </footer>
    )
}

export default Footer
