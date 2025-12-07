import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface SmartPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number; // how many pages to show on each side of current
}

export function SmartPagination({
  page,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1,
}: SmartPaginationProps) {
  if (totalPages < 1) return null;

  const createPageArray = () => {
    const pages: (number | "ellipsis")[] = [];
    const startPage = Math.max(2, page - siblingCount);
    const endPage = Math.min(totalPages - 1, page + siblingCount);

    pages.push(1);

    if (startPage > 2) {
      pages.push("ellipsis");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageArray = createPageArray();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : 0}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
            onClick={e => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>
        {pageArray.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={page === p}
                onClick={e => {
                  e.preventDefault();
                  if (page !== p) onPageChange(Number(p));
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === totalPages}
            tabIndex={page === totalPages ? -1 : 0}
            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            onClick={e => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}