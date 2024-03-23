export const usePagination = (currentPage: any, totalPages: any) => {
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
