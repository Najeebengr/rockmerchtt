import { writeClient } from '@/sanity/lib/client';

export async function POST(req) {
  try {
    const productData = await req.json();
    
    // Create the product with Sanity
    const result = await writeClient.create(productData);

    return Response.json({ success: true, result });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 