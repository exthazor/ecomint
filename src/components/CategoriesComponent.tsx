import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';

const CategoriesComponent = () => {
    const [page, setPage] = useState(1);
    const pageSize = 6;
  
    const {
      data: categoriesData,
      isLoading,
      isError,
      error,
      refetch,
    } = trpc.category.list.useQuery({
      page,
      limit: pageSize,
    });
  
    const toggleInterestMutation = trpc.category.toggleInterest.useMutation({
      onSuccess: () => {
        refetch();
      },
    });
  
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
  
    return (
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold text-center my-4">Please mark your interests!</h2>
        <div className="flex justify-center items-center flex-wrap gap-4">
          {categoriesData?.categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded border ${category.isInterested ? 'bg-blue-500 text-white' : 'bg-white text-black border-gray-300'}`}
              onClick={() => toggleInterestMutation.mutate({ categoryId: category.id, interested: !category.isInterested })}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => {
              if (categoriesData?.hasMore) {
                setPage((old) => old + 1);
              }
            }}
            disabled={!categoriesData?.hasMore}
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default CategoriesComponent;