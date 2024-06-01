import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function Pagination({
  makeLink,
  currentPage,
  totalPages,
}: {
  makeLink: (page: number) => string;
  currentPage: number;
  totalPages: number;
}) {
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage === 1) {
      return [1, 2, 3];
    } else if (currentPage === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  };

  const visiblePages = getVisiblePages();

  return (
    <PaginationContainer>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={makeLink(Math.max(1, currentPage - 1))} />
          </PaginationItem>
        )}
        {visiblePages[0] > 1 && (
          <>
            <PaginationItem key={1}>
              <PaginationLink href={makeLink(1)} isActive={1 === currentPage}>
                1
              </PaginationLink>
            </PaginationItem>
            {visiblePages[0] > 2 && (
              <PaginationItem key="start-ellipsis">
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={makeLink(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <PaginationItem key="end-ellipsis">
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem key={totalPages}>
              <PaginationLink
                href={makeLink(totalPages)}
                isActive={totalPages === currentPage}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={makeLink(Math.min(totalPages, currentPage + 1))}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationContainer>
  );
}
