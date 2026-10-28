import { cn } from "@/lib/utils"

const gradients = [
  "from-[#ff4f7b] to-[#7b2ff7]",
  "from-[#ffb020] to-[#ff4f7b]",
  "from-[#8cc700] to-[#0ea5a4]",
  "from-[#7b2ff7] to-[#2f6bff]",
  "from-[#0ea5a4] to-[#ffb020]",
  "from-[#ff7a45] to-[#d6246e]",
]

// picks the same gradient every time for the same name
function pickGradient(name: string) {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return gradients[sum % gradients.length]
}

type Props = {
  src?: string
  name: string
  className?: string
  round?: boolean
}

// shows the image if we have one, otherwise a colored box with the first letter
export default function Cover({ src, name, className, round }: Props) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        crossOrigin="anonymous"
        className={cn("shrink-0 object-cover", round ? "rounded-full" : "rounded-md", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br font-display font-bold text-white",
        pickGradient(name),
        round ? "rounded-full" : "rounded-md",
        className
      )}
    >
      {name.charAt(0)}
    </div>
  )
}
