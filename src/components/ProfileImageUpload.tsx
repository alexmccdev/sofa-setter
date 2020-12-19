import CropImageEditor from './shared/CropImageEditor'
import React, { useCallback, useRef, useState } from 'react'
import Tippy from '@tippyjs/react'
import axios from 'axios'
import useToast from '@hooks/useToast'
import { FileRejection, useDropzone } from 'react-dropzone'

interface ProfileImageUploadProps {
    handleProfileImageUpdate: (imageUrl: string) => void
    userImageUrl?: string
    inputId?: string
    inputName?: string
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = (props) => {
    const editorRef = useRef(null)
    const { showError, showSuccess } = useToast()

    const [localFile, setLocalFile] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [editVisible, setEditVisible] = useState(false)

    const onDrop = useCallback((acceptedFiles: any[], rejectedFiles: FileRejection[]) => {
        // If the file does not meet requirements, show error
        rejectedFiles.forEach((rejectedFile) => {
            rejectedFile.errors.forEach((err) => {
                switch (err.code) {
                    case 'file-too-large':
                        showError('File is larger than 3MB.')
                        break
                    default:
                        showError(err.message)
                }
            })
        })

        // Set the file for a preview
        acceptedFiles.forEach(async (acceptedFile: File) => {
            setLocalFile(
                Object.assign(acceptedFile, {
                    preview: URL.createObjectURL(acceptedFile),
                }),
            )
        })
    }, [])

    const uploadPhoto = async (acceptedFile: File) => {
        const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
        setIsUploading(true)

        const {
            data: { signature, timestamp, eager },
        } = await axios.post('/api/images/sign', { eager: 'w_250,h_250' })

        const formData = new FormData()

        formData.append('file', acceptedFile)
        formData.append('signature', signature)
        formData.append('timestamp', timestamp)
        formData.append('eager', eager)
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_PUBLIC_KEY)

        try {
            const { data } = await axios.post(url, formData)
            setLocalFile(null)
            setUploadedFile(data)
            setIsUploading(false)
            props.handleProfileImageUpdate(data.eager[0].secure_url)
        } catch {
            setLocalFile(null)
            setIsUploading(false)
            showError('Oops! Something went wrong during upload')
        }
    }

    const handleImageCrop = async () => {
        const canvas: HTMLCanvasElement = editorRef.current.getImage()

        canvas.toBlob(
            async (blob) => {
                await uploadPhoto(new File([blob], 'temp'))
            },
            'image/jpeg',
            0.95,
        )
    }

    const handleImageUploadCancel = () => {
        setLocalFile(null)
        setUploadedFile(null)
    }

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
        maxSize: process.env.NODE_ENV !== 'production' ? 10485760 : 3145728, // 3MB
        noClick: true,
    })

    if (localFile) {
        return (
            <CropImageEditor
                ref={editorRef}
                imageUrl={localFile.preview}
                onAccept={handleImageCrop}
                isUploading={isUploading}
                onCancel={handleImageUploadCancel}
            />
        )
    }

    return (
        <>
            <div {...getRootProps()} className="relative flex w-full mx-auto rounded-full focus:outline-none">
                <input type="file" id={props.inputId} name={props.inputName} {...getInputProps()} />
                <img
                    className="w-full rounded-full object-fit"
                    src={props.userImageUrl || uploadedFile?.eager[0].secure_url || '/default_profile_picture.jpg'}
                />
                <Tippy
                    content={
                        <div className="flex flex-col">
                            {props.userImageUrl !== '/default_profile_picture.jpg' && (
                                <div
                                    role="button"
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                        setEditVisible(false)
                                        props.handleProfileImageUpdate('/default_profile_picture.jpg')
                                    }}
                                >
                                    🗑️ Revert to default
                                </div>
                            )}
                            <div
                                role="button"
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                    setEditVisible(false)
                                    open()
                                }}
                            >
                                🖼️ Upload a picture
                            </div>
                        </div>
                    }
                    theme="default"
                    visible={editVisible}
                    onClickOutside={() => setEditVisible(false)}
                    animation={false}
                    placement="bottom-start"
                    interactive={true}
                    arrow={false}
                >
                    <button
                        className="absolute bottom-0 left-0 mb-2 ml-2 bg-white btn-sm"
                        onClick={() => setEditVisible((prev) => !prev)}
                    >
                        ✏️ Edit
                    </button>
                </Tippy>
            </div>
        </>
    )
}

export default ProfileImageUpload
