import { NextRequest, NextResponse } from 'next/server'

// This is a dummy auth handler that always allows access
export async function GET(req: NextRequest) {
  return NextResponse.json({
    providers: [],
    callbackUrl: '/boards',
    csrfToken: 'dummy-csrf-token',
    status: 'success',
  })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    status: 'success',
  })
}
