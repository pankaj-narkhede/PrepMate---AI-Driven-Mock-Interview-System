import { Toaster } from "sonner"


export const ToastProvider = () => {
  return (
    <>
    <Toaster
    theme="light"
    richColors
    position="top-right"
    className="bg-amber-500 shadow-lg"

    /></>
  )
}
