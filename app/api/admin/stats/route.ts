// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('Stats API called')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Test basic connection first
    const { data: testData, error: testError } = await supabase
      .from('articles')
      .select('id, title, category, status')
      .limit(1)

    if (testError) {
      console.error('Test query error:', testError)
      return NextResponse.json(
        { error: 'Database connection failed', details: testError.message },
        { status: 500 }
      )
    }

    console.log('Test query successful, sample data:', testData)

    // Get total articles count
    const { count: totalCount, error: totalError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      console.error('Error fetching total count:', totalError)
      return NextResponse.json(
        { error: 'Failed to fetch total count', details: totalError.message },
        { status: 500 }
      )
    }

    console.log('Total count:', totalCount)

    // Get published articles count
    const { count: publishedCount, error: publishedError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    if (publishedError) {
      console.error('Error fetching published count:', publishedError)
      return NextResponse.json(
        { error: 'Failed to fetch published count', details: publishedError.message },
        { status: 500 }
      )
    }

    console.log('Published count:', publishedCount)

    // Get category stats
    const { data: categoryData, error: categoryError } = await supabase
      .from('articles')
      .select('category')

    if (categoryError) {
      console.error('Error fetching category data:', categoryError)
      return NextResponse.json(
        { error: 'Failed to fetch category data', details: categoryError.message },
        { status: 500 }
      )
    }

    console.log('Category data:', categoryData)

    // Count articles by category
    const categoryStats: { [key: string]: number } = {}
    categoryData?.forEach(article => {
      const category = article.category
      if (category) {
        categoryStats[category] = (categoryStats[category] || 0) + 1
      }
    })

    console.log('Category stats:', categoryStats)

    const stats = {
      total: totalCount || 0,
      published: publishedCount || 0,
      views: 0, // Views column doesn't exist yet
      categoryStats
    }

    console.log('Final stats:', stats)
    return NextResponse.json(stats)

  } catch (error) {
    console.error('Error in stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
