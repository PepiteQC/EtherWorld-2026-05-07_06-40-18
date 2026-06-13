import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn — combine des classes Tailwind intelligemment
 * (helper standard shadcn/ui, utilisé partout dans le projet)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}
