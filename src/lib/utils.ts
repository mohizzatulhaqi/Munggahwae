import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent currency formatting to avoid hydration errors
export function formatCurrency(amount: number): string {
  // Use a consistent format that works the same on server and client
  const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `Rp${formatted}`
}

// Alternative with more explicit formatting
export function formatCurrencyDetailed(amount: number): string {
  const parts = amount.toString().split(".")
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const decimalPart = parts[1] ? `.${parts[1]}` : ""
  return `Rp${integerPart}${decimalPart}`
}

function convertBigIntToString(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}
