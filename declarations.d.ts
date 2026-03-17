declare module '@supabase/auth-helpers-nextjs' {
  import { NextRequest, NextResponse } from 'next/server'
  import { SupabaseClient } from '@supabase/supabase-js'

  export type createMiddlewareClient = (context: {
    req: NextRequest
    res: NextResponse
  }) => SupabaseClient
}

declare module '@supabase/auth-helpers-nextjs/dist/middleware' {
  export * from '@supabase/auth-helpers-nextjs'
}