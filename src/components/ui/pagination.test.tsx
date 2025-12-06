import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination';

describe('Pagination', () => {
  it('should render pagination links correctly', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    expect(screen.getByText('More pages')).toBeInTheDocument();
  });

  it('should update focusedIndex when children change', () => {
    const { rerender } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link1 = screen.getByText('1');
    const link2 = screen.getByText('2');

    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');

    rerender(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationLink href="#">A</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">B</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">C</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const linkA = screen.getByText('A');
    const linkB = screen.getByText('B');
    const linkC = screen.getByText('C');

    expect(linkA).toHaveAttribute('tabindex', '0');
    expect(linkB).toHaveAttribute('tabindex', '-1');
    expect(linkC).toHaveAttribute('tabindex', '-1');
  });

  it('should correctly assign tabIndex for keyboard navigation', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const link1 = screen.getByText('1');
    const link2 = screen.getByText('2');
    const link3 = screen.getByText('3');

    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'ArrowLeft' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'Home' });
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();

    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'End' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveFocus();
  });

  it('should render correctly for a single page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" aria-disabled="true" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" aria-disabled="true" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const prevLink = screen.getByLabelText('Go to previous page');
    const nextLink = screen.getByLabelText('Go to next page');
    const page1Link = screen.getByText('1');

    expect(page1Link).toBeInTheDocument();
    expect(prevLink).toHaveAttribute('aria-disabled', 'true');
    expect(nextLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable previous button on the first page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" aria-disabled="true" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" aria-disabled="false" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const prevLink = screen.getByLabelText('Go to previous page');
    const nextLink = screen.getByLabelText('Go to next page');

    expect(prevLink).toHaveAttribute('aria-disabled', 'true');
    expect(nextLink).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable next button on the last page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" aria-disabled="false" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" aria-disabled="true" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const prevLink = screen.getByLabelText('Go to previous page');
    const nextLink = screen.getByLabelText('Go to next page');

    expect(prevLink).not.toHaveAttribute('aria-disabled', 'true');
    expect(nextLink).toHaveAttribute('aria-disabled', 'true');
  });
});
