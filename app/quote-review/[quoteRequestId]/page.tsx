import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {MultiProductQuoteReviewComponent} from '@components/quote-review/multi-product-quote-review.component';
import {ReactQueryClientProvider} from '../../query-client-provider';

interface PageProps {
  params: Promise<{quoteRequestId: string}>;
}

const MultiProductQuoteReviewPage = async ({params}: PageProps) => {
  const {quoteRequestId} = await params;

  return (
    <ReactQueryClientProvider>
      <MultiProductQuoteReviewComponent quoteRequestId={quoteRequestId} />
    </ReactQueryClientProvider>
  );
};

export default MultiProductQuoteReviewPage;

export const metadata: Metadata = {
  title: `Quote Review | ${metaConstants.SITE_NAME}`,
  description: 'Review and approve your multi-product quote',
  robots: {
    index: false,
    follow: false
  }
};
