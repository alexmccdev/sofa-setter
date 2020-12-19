import { toast } from 'react-toastify'

const useToast = () => {
    const showSuccess = (message: string, durationInSeconds: number = 5) => {
        toast.success(message, {
            autoClose: durationInSeconds * 1000,
            className: 'bg-success rounded-sm',
        })
    }
    const showWarning = (message: string, durationInSeconds: number = 5) => {
        toast.warn(message, {
            autoClose: durationInSeconds * 1000,
            className: 'bg-warn rounded-sm',
        })
    }
    const showError = (message: string, durationInSeconds: number = 5) => {
        toast.error(message, {
            autoClose: durationInSeconds * 1000,
            className: 'bg-error rounded-sm',
        })
    }
    return {
        showSuccess,
        showWarning,
        showError,
    }
}

export default useToast
