import { layoutView } from '@/cartStore';
import type { PageInfo, Product } from '@/lib/shopify/types';
import { useStore } from '@nanostores/react';
import React, { Suspense, lazy } from 'react';
import SkeletonCards from './loadings/skeleton/SkeletonCards';

const ProductGrid = lazy(() => import('./ProductGrid'));
const ProductList = lazy(() => import('./ProductList'));

const ProductLayoutViews = ({
  initialProducts,
  initialPageInfo,
  sortKey,
  reverse,
  searchValue,
}: {
  initialProducts: Product[];
  initialPageInfo: PageInfo;
  sortKey: string;
  reverse: boolean;
  searchValue: string | null;
}) => {
  const layout = useStore(layoutView);

  return (
    <div className="col-12 lg:col-9">
      <Suspense fallback={<SkeletonCards />}>
        {layout === 'list' ? (
          <ProductList
            initialProducts={initialProducts}
            initialPageInfo={initialPageInfo}
            sortKey={sortKey}
            reverse={reverse}
            searchValue={searchValue}
          />
        ) : (
          <ProductGrid
            initialProducts={initialProducts}
            initialPageInfo={initialPageInfo}
            sortKey={sortKey}
            reverse={reverse}
            searchValue={searchValue}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ProductLayoutViews;
