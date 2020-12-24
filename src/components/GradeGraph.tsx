import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { Problem } from '@prisma/client'

interface GraphGraphProps {
    problems: Problem[]
    color: string
}

const GradeGraph: React.FC<GraphGraphProps> = (props) => {
    // No data - don't do anything
    if (props.problems.length === 0) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <h2 className="text-center opacity-25">No problems have been set! You could be the first!</h2>
            </div>
        )
    }

    // Accumulate the grade counts into shared object, combine V10+
    const reducedProblems = props.problems.reduce(
        (acc, problem: Problem) => {
            const { grade } = problem
            if (Number(grade.slice(1)) >= 10) {
                return { ...acc, ['V10+']: (acc['V10+'] += 1) || 1 }
            } else {
                return { ...acc, [grade]: (acc[grade] += 1) || 1 }
            }
        },
        {
            V0: 0,
            V1: 0,
            V2: 0,
            V3: 0,
            V4: 0,
            V5: 0,
            V6: 0,
            V7: 0,
            V8: 0,
            V9: 0,
            'V10+': 0,
        },
    )

    // Sort the grade in ascending order and format into an array of {x: grade, y: count} format
    let data = Object.keys(reducedProblems)
        .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
        .map((p) => {
            return { x: p, y: reducedProblems[p] }
        })

    // Trim off the hard grades at the end until we reach one with count of at least 1
    // for (let i = data.length - 1; i >= 0; i--) {
    //     if (data[i].y === 0) {
    //         data.splice(i, 1)
    //     } else {
    //         break
    //     }
    // }

    // Place into formate that nivo likes
    const rlData = [{ id: 'GradeGraph', data }]

    return (
        <div className="flex w-full h-full">
            <ResponsiveLine
                data={rlData}
                margin={{ top: 10, right: 16, bottom: 30, left: 16 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 'auto' }}
                curve="basis"
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                }}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                lineWidth={4}
                enablePoints={false}
                enableArea={true}
                isInteractive={false}
                enableCrosshair={false}
                colors={[props.color]}
                theme={{ fontSize: 14 }}
            />
        </div>
    )
}

export default GradeGraph
