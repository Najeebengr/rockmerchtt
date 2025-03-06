import { writeClient } from '@/sanity/lib/client';

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch image');

    // Get the file extension and content type
    const contentType = imageResponse.headers.get('content-type');
    let extension = 'jpg';
    if (contentType) {
      if (contentType.includes('jpeg')) extension = 'jpg';
      else if (contentType.includes('png')) extension = 'png';
      else if (contentType.includes('webp')) extension = 'webp';
      else if (contentType.includes('gif')) extension = 'gif';
    }

    // Convert to buffer
    const imageBuffer = await imageResponse.arrayBuffer();

    // Upload to Sanity
    const asset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), {
      filename: `image-${Date.now()}.${extension}`,
      contentType
    });

    return Response.json({
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: asset._id
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 