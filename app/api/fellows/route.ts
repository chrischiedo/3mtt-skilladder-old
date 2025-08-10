import { NextResponse } from 'next/server';
import client from '@/lib/mongodb-connection';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const sort = searchParams.get('sort') || 'fellow_id';
  const order = searchParams.get('order') || 'asc';

  try {
    await client.connect();
    const database = client.db('myDatabase');
    const collection = database.collection('recipes');

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Build sort object
    const sortObj: { [key: string]: 1 | -1 } = {
      [sort]: order === 'asc' ? 1 : -1,
    };

    // Get total count for pagination
    const total = await collection.countDocuments({
      fellow_id: { $regex: '^FE/' },
    });

    // Fetch paginated data
    const fellows = await collection
      .find(
        { fellow_id: { $regex: '^FE/' } },
        {
          projection: {
            fellow_id: 1,
            'biodata.firstName': 1,
            'biodata.lastName': 1,
            cohort: 1,
            selected_career: 1,
            'biodata.state': 1,
            technical_score_mcq: 1,
          },
        }
      )
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    // Format the data
    const formattedData = fellows.map((fellow) => ({
      id: fellow.fellow_id,
      firstName: fellow.biodata?.firstName || '',
      lastName: fellow.biodata?.lastName || '',
      cohort: fellow.cohort || '',
      career: fellow.selected_career || '',
      state: fellow.biodata?.state || '',
      score: fellow.technical_score_mcq || 0,
    }));

    return NextResponse.json({
      data: formattedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching fellows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fellows' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
