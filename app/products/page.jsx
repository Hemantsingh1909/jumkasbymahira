'use client';

import { Suspense } from 'react';
import ProductsContent from './products-content';

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-custom py-12">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
