import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from "@/components/ui/toast/toast"

const TOAST_REMOVE_DELAY = 1000000

type ToasterToastProps = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

const toastTypes = {
  default: {
    variant: "default" as const,
  },
  destructive: {
    variant: "destructive" as const,
  },
}

const Toaster = () => {
  const [toasts, setToasts] = React.useState<ToasterToastProps[]>([])

  const createToastInstance = (
    props: Omit<ToasterToastProps, "id">,
    opts?: { id?: string },
  ) => {
    const id = opts?.id ?? Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...props }])
    return id
  }

  React.useEffect(() => {
    return () => {
      toasts.forEach((toast) => {
        window.clearTimeout(toast.id)
      })
    }
  }, [toasts])

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            onOpenChange={(open: boolean) => {
              if (!open) {
                setToasts((prev) =>
                  prev.filter((toast) => toast.id !== id),
                )
              }
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

const useToast = () => {
  const [, setToasts] = React.useState<ToasterToastProps[]>([])

  const toast = (props: Omit<ToasterToastProps, "id"> & { id?: string }) => {
    const id = props.id ?? Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...props }])
    return id
  }

  toast.dismiss = (toastId?: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId))
  }

  toast.default = (
    props: Omit<
      Omit<ToasterToastProps, "id"> & { id?: string },
      "variant"
    >,
  ) => toast({ ...props, variant: "default" })

  toast.destructive = (
    props: Omit<
      Omit<ToasterToastProps, "id"> & { id?: string },
      "variant"
    >,
  ) => toast({ ...props, variant: "destructive" })

  return toast
}

export { Toaster, useToast }
