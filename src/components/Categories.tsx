import React, { useState, useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import CategoriesDialog from '~/components/CategoriesDialog';
import Loader from './Loader';
import { usePagination } from '~/hooks/usePagnation';

type Category = {
  id: number;
  name: string;
  isInterested: boolean;
};

type RenderPaginationButtonsProps = {
  pageNumbers: (number | '...')[];
  setPage: (page: number) => void;
  page: number;
  totalPages: number;
  categoriesData: {
    hasMore: boolean;
  } | undefined;
};

const CategoriesComponent = () => {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const pageSize = 6;
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const { data: categoriesData, isLoading, isError, error } = trpc.category.list.useQuery({ page, limit: pageSize });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.categories);
      const newTotalPages = Math.ceil(categoriesData.total / pageSize);
      setTotalPages(newTotalPages);
    }
  }, [categoriesData, pageSize]);

  const pageNumbers = usePagination(page, totalPages);

  const toggleInterestMutation = trpc.category.toggleInterest.useMutation();

  const handleCheckboxChange = (categoryId: number, currentInterest: boolean) => {
    const updatedCategories = categories.map((category) => 
      category.id === categoryId ? { ...category, isInterested: !currentInterest } : category
    );
    setCategories(updatedCategories);
    toggleInterestMutation.mutate({ categoryId, interested: !currentInterest });
  };

  if (loading || isLoading) return <Loader />;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <CategoriesDialog title="Please mark your interests!" subtitle="We will keep you notified." subtitle2="My saved interests!">
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
      <div className="flex text-xs justify-center mt-12 space-x-2">
        {/* Pagination Buttons */}
        {renderPaginationButtons({pageNumbers, setPage, page, totalPages, categoriesData})}
      </div>
    </CategoriesDialog>
  );
};

function renderPaginationButtons({
  pageNumbers,
  setPage,
  page,
  totalPages,
  categoriesData,
}: RenderPaginationButtonsProps) {

  const firstAndPreviousButtons = [
    <button key="first" onClick={() => setPage(1)} disabled={page === 1}>
      {"<<"}
    </button>,
    <button key="prev" onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
      {"<"}
    </button>,
  ];

  const pageNumberButtons = pageNumbers.map((pageNumber) => {
    if (pageNumber === '...') {
      return <span key={String(pageNumber)} className="py-2 px-4">...</span>;
    } else {
      return (
        <button
          key={String(pageNumber)}
          className={`py-2 px-4 ${page === pageNumber ? 'text-black' : 'text-gray-500'} hover:text-gray-800`}
          onClick={() => setPage(pageNumber as number)}
        >
          {pageNumber}
        </button>
      );
    }
  });

  const nextAndLastButtons = [
    <button key="next" onClick={() => setPage(Math.min(page + 1, totalPages))} disabled={!categoriesData?.hasMore}>
      {">"}
    </button>,
    <button key="last" onClick={() => setPage(totalPages)} disabled={!categoriesData?.hasMore}>
      {">>"}
    </button>,
  ];

  return [...firstAndPreviousButtons, ...pageNumberButtons, ...nextAndLastButtons];
}


export default CategoriesComponent;
