import {Metadata} from 'next';
import {metaConstants} from '@utils/constants';
import {ProofReviewComponent} from '@components/proof/proof-review.component';
import {ReactQueryClientProvider} from '../../query-client-provider';

interface PageProps {
  params: Promise<{token: string}>;
}

const ProofReviewPage = async ({params}: PageProps) => {
  const {token} = await params;

  return (
    <ReactQueryClientProvider>
      <ProofReviewComponent proofId={token} />
    </ReactQueryClientProvider>
  );
};

export default ProofReviewPage;

export const metadata: Metadata = {
  title: `Proof Review | ${metaConstants.SITE_NAME}`,
  description: 'Review and approve your custom product proof',
  robots: {
    index: false,
    follow: false
  }
};
