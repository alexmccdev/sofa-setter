import * as React from 'react'
import { Range as R } from 'react-range'

interface RangeProps extends React.HTMLAttributes<HTMLDivElement> {
    min: number
    max: number
    step: number
    values: number[]
    handleRangeChange: (value: number[]) => void
    className?: string
}

const Range: React.FC<RangeProps> = (props) => {
    return (
        <div className={props.className}>
            <R
                step={props.step}
                min={props.min}
                max={props.max}
                values={props.values}
                onChange={(val) => props.handleRangeChange(val)}
                renderTrack={({ props, children }) => (
                    <div {...props} className="w-full h-2 border border-black rounded-sm">
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div {...props} className="w-4 h-4 border border-black rounded-full bg-primary"></div>
                )}
            />
        </div>
    )
}

export default Range
