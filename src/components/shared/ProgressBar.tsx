import React from 'react'

interface ProgressBarProps {
    max: number
    value: number
    backgroundColorClass?: string
    progressBarColorClass: string
}

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
    return (
        <div
            role="progressbar"
            aria-valuenow={props.value}
            aria-valuemin={0}
            aria-valuemax={props.max}
            className="w-full relative"
        >
            <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${props.backgroundColorClass || ''}`}>
                <div
                    style={{ width: `${Math.round((props.value * 100) / props.max)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${props.progressBarColorClass}`}
                ></div>
            </div>
        </div>
    )
}

export default ProgressBar
