import { writeClient } from '@/sanity/lib/client';

export async function POST(req) {
  try {
    const data = await req.json();
    
    // Create the product using the write client
    const result = await writeClient.create({
      _type: 'products',
      ...data
    });

    return Response.json({ success: true, result });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 