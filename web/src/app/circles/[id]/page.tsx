import CircleView from './CircleView';

// Wrapper for dynamic route
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CircleView circleId={id} />;
}

// Generate static params if needed, but for dynamic we just export Page
