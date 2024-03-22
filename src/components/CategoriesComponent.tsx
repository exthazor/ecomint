// Import React, useState, useEffect, useRouter from 'next/router', trpc, and the CategoriesModal component
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import CategoriesModal from './CategoriesModal';

const usePagination = (currentPage: any, totalPages: any) => {
    const totalBlocks = 7; // This is the total number of pagination blocks (including ellipses, but excluding the first and last page)
  
    const range = (start: any, end: any) => {
      return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
    };
  
    if (totalPages <= totalBlocks) {
      // Less total pages than blocks, no need for ellipses
      return range(1, totalPages);
    }
  
    const startPages = range(1, 2); // Always include the first two pages
    const endPages = range(totalPages - 1, totalPages); // Always include the last two pages
  
    const blocks = [1, ...startPages];
  
    let middleRangeStart = Math.max(3, currentPage - 1);
    let middleRangeEnd = Math.min(totalPages - 2, currentPage + 1);
  
    if (currentPage - 1 <= 3) {
      // Current page is near the start; no left ellipsis needed
      middleRangeStart = 3;
      middleRangeEnd = 3 + totalBlocks - 4; // -4 to account for first, second, and last two pages
    }
  
    if (totalPages - currentPage <= 3) {
      // Current page is near the end; no right ellipsis needed
      middleRangeEnd = totalPages - 2;
      middleRangeStart = totalPages - 2 - (totalBlocks - 4); // -4 to account for last, second last, and first two pages
    }
  
    const middlePages = range(middleRangeStart, middleRangeEnd);
  
    // Now combine them all
    let paginationRange = [
      ...blocks,
      ...(middleRangeStart > 3 ? ['...'] : []),
      ...middlePages,
      ...(middleRangeEnd < totalPages - 2 ? ['...'] : []),
      ...endPages,
    ];
  
    // Ensure unique values only, as start and end ranges can overlap middle range
    paginationRange = [...new Set(paginationRange)];
  
    return paginationRange;
  };
  
const CategoriesComponent = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 6;
  const router = useRouter();
  const userName = typeof window !== "undefined" ? localStorage.getItem('userName') || 'User' : '';
  const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') || '' : '';



  // Replace 'category.list' and 'category.toggleInterest' with your actual tRPC hooks
  const { data: categoriesData, isLoading, isError, error } = trpc.category.list.useQuery({
    page,
    limit: pageSize,
  });

  // Update total pages based on the total number of categories
  useEffect(() => {
    if (categoriesData?.total) {
      setTotalPages(Math.ceil(categoriesData.total / pageSize));
    }
  }, [categoriesData, pageSize]);

  const pageNumbers = usePagination(page, totalPages); // Assume usePagination hook is defined elsewhere

  const toggleInterestMutation = trpc.category.toggleInterest.useMutation();

  const handleLogout = () => {
    // Function to handle user logout
    trpc.user.logout.useMutation().mutate(
      { authToken },
      {
        onSuccess: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userName');
          router.push('/login');
        },
      }
    );
  };

  const handleCheckboxChange = async (categoryId: number, isInterested: boolean) => {
    // Optimistically update the UI
    const updatedCategories = categoriesData?.categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, isInterested: !isInterested };
      }
      return category;
    });

    // Attempt to update the backend
    try {
      await toggleInterestMutation.mutateAsync({ categoryId, interested: !isInterested });
      // If backend call fails, you might want to revert the UI update or handle the error
    } catch (error) {
      console.error('Failed to update interest:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <CategoriesModal title="Please mark your interests!" subtitle='We will keep you notified.' subtitle2='My saved interests!'>
        <ul className="space-y-4">
          {categoriesData?.categories.map((category) => (
            <li key={category.id} className="flex items-center">
              <input
                type="checkbox"
                checked={category.isInterested}
                onChange={() => handleCheckboxChange(category.id, category.isInterested)}
                className={`form-checkbox h-5 w-5 mr-2 ${category.isInterested ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'} border-transparent`}
              />
              <span className={category.isInterested ? 'font-normal text-sm' : 'font-normal text-sm'}>{category.name}</span>
            </li>
          ))}
        </ul>
        {/* Pagination buttons */}
    <div className="flex text-xs justify-center mt-12 space-x-2">
    <button
    onClick={() => setPage(1)}
    disabled={page === 1}
    >
    {"<<"}
    </button>
    <button
    onClick={() => setPage(Math.max(page - 1, 1))}
    disabled={page === 1}
    >
    {"<"}
    </button>
    {pageNumbers.map((pageNumber) => {
    if (pageNumber === '...') {
        return <span className="py-2 px-4">...</span>;
    } else {
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
        </CategoriesModal>
        </div>
    );
    };

export default CategoriesComponent;
