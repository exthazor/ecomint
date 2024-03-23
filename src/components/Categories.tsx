import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import CategoriesDialog from './CategoriesDialog';

const usePagination = (currentPage: any, totalPages: any) => {
    const totalBlocks = 7; 
  
    const range = (start: any, end: any) => {
      return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    };
  
    if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }
  
    const startPages = range(1, 2);
    const endPages = range(totalPages - 1, totalPages);
    const blocks = [1, ...startPages];
  
    let middleRangeStart = Math.max(3, currentPage - 1);
    let middleRangeEnd = Math.min(totalPages - 2, currentPage + 1);
  
    if (currentPage - 1 <= 3) {
      middleRangeStart = 3;
      middleRangeEnd = 3 + totalBlocks - 4;
    }
  
    if (totalPages - currentPage <= 3) {
      middleRangeEnd = totalPages - 2;
      middleRangeStart = totalPages - 2 - (totalBlocks - 4);
    }
  
    const middlePages = range(middleRangeStart, middleRangeEnd);
  
    let paginationRange = [
      ...blocks,
      ...(middleRangeStart > 3 ? ['...'] : []),
      ...middlePages,
      ...(middleRangeEnd < totalPages - 2 ? ['...'] : []),
      ...endPages,
    ];

    paginationRange = [...new Set(paginationRange)];
    return paginationRange;
  };

  type Category = {
    id: number;
    name: string;
    isInterested: boolean;
  };

const CategoriesComponent = () => {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const pageSize = 6;
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0);
  const userName = typeof window !== "undefined" ? localStorage.getItem('userName') || 'User' : '';
  const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') || '' : '';

  const { data: categoriesData, isLoading, isError, error } = trpc.category.list.useQuery({ page, limit: pageSize });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.categories);
      setTotalPages(Math.ceil(categoriesData.total / pageSize));
    }
  }, [categoriesData]);

  const pageNumbers = usePagination(page, totalPages);

  const toggleInterestMutation = trpc.category.toggleInterest.useMutation();

  const handleCheckboxChange = (categoryId: number, currentInterest: boolean) => {
    // Optimistically update UI
    const updatedCategories = categories.map(category => category.id === categoryId ? { ...category, isInterested: !currentInterest } : category);
    setCategories(updatedCategories);

    // Perform actual update in the background
    toggleInterestMutation.mutate({ categoryId, interested: !currentInterest });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <CategoriesDialog title="Please mark your interests!" subtitle="We will keep you notified." subtitle2="My saved interests!">
      {/* Categories listing and checkbox handling */}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center">
            <input
              type="checkbox"
              checked={category.isInterested}
              onChange={() => handleCheckboxChange(category.id, category.isInterested)}
              className="form-checkbox h-5 w-5 mr-2"
            />
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
      {/* Pagination buttons */}
      <div className="flex text-xs justify-center mt-12 space-x-2">
        <button onClick={() => setPage(1)} disabled={page === 1}>
          {"<<"}
        </button>
        <button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
          {"<"}
        </button>
        {pageNumbers.map((pageNumber) => {
          if (pageNumber === '...') {
            return <span className="py-2 px-4">...</span>;
          } 
          else {
            return (
              <button key={pageNumber} 
              className={`py-2 px-4 ${page === pageNumber ? 'text-black' : 'text-gray-500'} hover:text-gray-800`}
              onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          }
        })}
        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={!categoriesData?.hasMore}
        >
          {">"}
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={!categoriesData?.hasMore}
        >
          {">>"}
        </button>
      </div>
    </CategoriesDialog>
  );
};

export default CategoriesComponent;
