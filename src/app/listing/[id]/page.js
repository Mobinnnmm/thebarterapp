import ListingDetails from "../ListingDetails";

// Server Component
async function getListingData(id) {
  try {
    // Use absolute URL with the base URL
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseURL}/api/listing/${id}`, {
      method: 'GET',
      cache: 'no-store',
      
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch listing. Status: ${res.status}`);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

// Use searchParams and params as separate props
export default async function Page(props) {
  const params = await props.params;
  // Await the params before accessing id
  const id = await params?.id;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600">Invalid Listing ID</h2>
        </div>
      </div>
    );
  }

  const listingData = await getListingData(id);

  if (!listingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-600">Failed to load listing</h2>
        </div>
      </div>
    );
  }

  return <ListingDetails id={id} initialData={listingData} />;
}

// These configs help with the dynamic route
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

// Generate static params if needed
export async function generateStaticParams() {
  return [];
}
