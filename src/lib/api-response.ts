import { NextResponse } from 'next/server'

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400, errors?: unknown) {
  return NextResponse.json(
    { success: false, message, ...(errors ? { errors } : {}) },
    { status },
  )
}
