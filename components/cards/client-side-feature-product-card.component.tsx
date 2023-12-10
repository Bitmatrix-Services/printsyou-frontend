import dynamic from 'next/dynamic';
import {FeaturedProductCardProps} from '@components/cards/FeaturedProductCard';

export const ClientSideFeaturedProductCard = dynamic<FeaturedProductCardProps>(
  () =>
    import('@components/cards/FeaturedProductCard').then(
      component => component.InnerFeaturedProductCard
    ),
  {ssr: false, loading: () => null}
);
