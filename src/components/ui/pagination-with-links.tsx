"use client";

import { type ReactNode, useCallback } from "react";
import { Pagination, PaginationContent, PaginationItem } from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
  keys: string;
}

/**
 * Navigate with Nextjs links (need to update your own `pagination.tsx` to use Nextjs Link)
 * 
 * @example
 * ```
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
  />
 * ```
 */
export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam,
  keys,
}: PaginationWithLinksProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = useQueryClient();
  const totalPageCount = Math.ceil(totalCount / pageSize);

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      if (!searchParams) return `${pathname}?${key}=${newPage}`;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, String(newPage));

      return `${pathname}?${newSearchParams.toString()}`;
    },
    [searchParams, pathname, pageSearchParam]
  );

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.set(key, String(newPageSize));
      newSearchParams.delete(pageSearchParam || "page"); // Clear the page number when changing page size
      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname, pageSearchParam, router, pageSizeSelectOptions]
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 3;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <button
              className={`${
                i === page
                  ? "bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
                  : "hover:text-gray-900 hover:bg-gray-100  text-gray-500"
              } w-8  h-8  rounded-md flex items-center justify-center text-xs`}
              onClick={() => {
                query.refetchQueries({ queryKey: [keys] });
                router.push(buildLink(i));
              }}
            >
              {i}
            </button>
          </PaginationItem>
        );
      }
    } else {
      items.push(<PaginationItem key={1}></PaginationItem>);

      const start = Math.max(1, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <button
              aria-label="Page"
              className={`${
                i === page
                  ? "bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
                  : "hover:text-gray-900 hover:bg-gray-100  text-gray-500"
              } w-8  h-8  rounded-md flex items-center justify-center text-xs`}
              onClick={() => {
                router.push(buildLink(i));
                query.refetchQueries({ queryKey: [keys] });
              }}
            >
              {i}
            </button>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      {pageSizeSelectOptions && (
        <div className="flex flex-col gap-4 flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <button
              onClick={() => router.push(buildLink(Math.max(page - 1, 1)))}
              aria-disabled={page === 1}
              disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={`${
                page === 1 ? "pointer-events-none opacity-50" : undefined
              } w-8 h-8 hover:bg-gray-100 hover:text-gray-900 text-gray-500 rounded-md flex items-center justify-center`}
            >
              <ChevronLeft size={16} />
            </button>
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <button
              onClick={() =>
                router.push(buildLink(Math.min(page + 1, totalPageCount)))
              }
              aria-disabled={page === totalPageCount}
              disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={`w-8 h-8 hover:bg-gray-100 hover:text-gray-900 text-gray-500 rounded-md flex items-center justify-center ${
                page === totalPageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Rows per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value: string) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
