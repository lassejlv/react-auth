import { Loader } from "lucide-react"

export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <Loader className="animate-spin" size={size} />
  )
}
