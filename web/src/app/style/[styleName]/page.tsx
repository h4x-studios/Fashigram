import StylePageView from '../StylePageView';

export default async function Page({ params }: { params: Promise<{ styleName: string }> }) {
    const { styleName } = await params;
    return <StylePageView styleName={decodeURIComponent(styleName)} />;
}
