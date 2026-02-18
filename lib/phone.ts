const DEFAULT_AREA_CODE = "55"

/**
 * Extracts only digits from a phone string
 */
export function parsePhoneDigits(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * Formats phone for display: +55 (11) 98765-4321
 * Handles both mobile (9 digits after DDD) and landline (8 digits after DDD)
 */
export function formatPhoneForDisplay(
  value: string | null | undefined,
  areaCode: string = DEFAULT_AREA_CODE
): string {
  if (!value) return ""

  const digits = parsePhoneDigits(value)
  if (digits.length === 0) return ""

  // Ensure we have country code - prepend 55 if only Brazilian number
  let normalized = digits
  if (digits.length >= 10 && !digits.startsWith("55")) {
    normalized = "55" + digits
  } else if (digits.length < 10) {
    normalized = areaCode + digits
  }

  // +55 (11) 98765-4321 - mobile (13 digits: 55 + DDD + 9)
  if (normalized.length >= 13) {
    return `+${normalized.slice(0, 2)} (${normalized.slice(2, 4)}) ${normalized.slice(4, 9)}-${normalized.slice(9, 13)}`
  }
  // +55 (11) 09876-5432 - landline (12 digits): pad with 0 to match XXXXX-XXXX format
  if (normalized.length >= 12) {
    const num = normalized.slice(4, 12)
    return `+${normalized.slice(0, 2)} (${normalized.slice(2, 4)}) 0${num.slice(0, 4)}-${num.slice(4, 8)}`
  }
  // Partial format as user types
  if (normalized.length >= 10) {
    return `+${normalized.slice(0, 2)} (${normalized.slice(2, 4)}) ${normalized.slice(4)}`
  }
  if (normalized.length >= 6) {
    return `+${normalized.slice(0, 2)} (${normalized.slice(2, 4)}) ${normalized.slice(4)}`
  }
  if (normalized.length >= 4) {
    return `+${normalized.slice(0, 2)} (${normalized.slice(2)}`
  }
  if (normalized.length >= 2) {
    return `+${normalized}`
  }
  return normalized ? `+${normalized}` : ""
}

/**
 * Formats phone input as user types - returns formatted string for the input value
 * Output: +55 (11) 98765-4321
 */
export function formatPhoneInput(
  value: string,
  _areaCode: string = DEFAULT_AREA_CODE
): string {
  const digits = parsePhoneDigits(value)

  // Limit to 13 digits (55 + 2 DDD + 9 mobile)
  const d = digits.slice(0, 13)
  if (d.length === 0) return ""

  let result = "+"
  if (d.length >= 2) result += d.slice(0, 2)
  if (d.length > 2) result += ` (${d.slice(2, 4)}`
  if (d.length > 4) result += `) ${d.slice(4, 9)}`
  if (d.length > 9) result += `-${d.slice(9, 13)}`

  return result
}

/**
 * Normalizes phone for storage - returns formatted string or null
 * Accepts raw digits or already formatted input
 */
export function normalizePhoneForStorage(value: string | null | undefined): string | null {
  if (!value || typeof value !== "string") return null

  const digits = parsePhoneDigits(value)
  if (digits.length < 10) return null

  // Ensure Brazilian format: 55 + DDD + number (min 12 digits)
  let normalized = digits
  if (!digits.startsWith("55") && digits.length >= 10) {
    normalized = "55" + digits
  }

  if (normalized.length < 12) return null
  return formatPhoneForDisplay(normalized)
}
