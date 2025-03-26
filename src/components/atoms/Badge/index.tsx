import { Badge as Base } from '@/components/ui/badge'
import Text from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { VariantProps } from 'class-variance-authority'
import { ReactNode } from 'react'
interface IBadge {
    className?: string,
    label: string,
    action?: () => void,
    icon?: ReactNode,
    iconSide?: "left" | "right"
}

function Badge({ className, label, action, icon, iconSide = 'right', variant }: IBadge & VariantProps<typeof Base>) {
    return (
        <Base variant={variant} className={cn('flex items-center gap-2 justify-between select-none', className)}>
            {iconSide === "left" && (<div className='cursor-pointer' onClick={action}>{icon}</div>)}
            <Text variant='span' className='font-normal'>{label}</Text>
            {iconSide === "right" && (<div className='cursor-pointer' onClick={action}>{icon}</div>)}
        </Base >
    )
}

export default Badge
