import useDimensions from 'react-use-dimensions'
import React, { useState } from 'react'
import Range from './Range'
import AvatarEditor from 'react-avatar-editor'

interface CropImageEditorProps {
    ref: any
    imageUrl: string
    onAccept: () => void
    onCancel: () => void
    isUploading: boolean
}

const CropImageEditor: React.ForwardRefExoticComponent<CropImageEditorProps> = React.forwardRef((props, ref) => {
    const [containerRef, { width }] = useDimensions()
    const [scale, setScale] = useState([1])

    return (
        <div className="w-full" ref={containerRef}>
            <AvatarEditor
                ref={ref}
                image={props.imageUrl}
                borderRadius={999}
                border={0}
                width={width}
                height={width}
                scale={scale[0]}
                className="w-full mb-4 object-fit"
                on
            />
            <Range
                id="scale"
                min={1}
                max={2}
                step={0.01}
                values={scale}
                handleRangeChange={setScale}
                className="mb-4"
            />
            <div className="flex">
                <button
                    className="flex justify-center w-full mr-2 bg-green-500 btn-sm"
                    onClick={props.onAccept}
                    disabled={props.isUploading}
                >
                    {props.isUploading ? 'Uploading...' : 'Accept'}
                </button>
                <button
                    className="flex justify-center w-full ml-2 btn-sm "
                    onClick={props.onCancel}
                    disabled={props.isUploading}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
})

export default CropImageEditor
