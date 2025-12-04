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
            <PaginationLink href="#">2</PaginationLink>
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

    // The first focusable element should have tabindex=0
    expect(screen.getByLabelText('Go to previous page')).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('1')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('2')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('3')).toHaveAttribute('tabindex', '-1');
    expect(screen.getByLabelText('Go to next page')).toHaveAttribute('tabindex', '-1');
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

    expect(link1).toHaveAttribute('tabindex', '0'); // First focusable
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

    expect(linkA).toHaveAttribute('tabindex', '0'); // First focusable
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

    const navigation = screen.getByRole('navigation');
    const link1 = screen.getByText('1');
    const link2 = screen.getByText('2');
    const link3 = screen.getByText('3');

    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '-1');
    link1.focus(); // Manually focus for keyboard events

    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'ArrowLeft' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'Home' });
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'End' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(link3).toHaveAttribute('tabindex', '0');
    expect(link3).toHaveFocus();
  });

  it('should handle PaginationPrevious and PaginationNext correctly', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const navigation = screen.getByRole('navigation');
    const prevLink = screen.getByLabelText('Go to previous page');
    const link1 = screen.getByText('1');
    const nextLink = screen.getByLabelText('Go to next page');

    expect(prevLink).toHaveAttribute('tabindex', '0');
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    prevLink.focus(); // Manually focus for keyboard events

    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(prevLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(prevLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '0');
    expect(nextLink).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(prevLink).toHaveAttribute('tabindex', '0');
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    expect(prevLink).toHaveFocus();
  });

  it('should render only one page when totalPages is 1', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" disabled />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" disabled />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toHaveAttribute('disabled', '');
    expect(screen.getByLabelText('Go to next page')).toHaveAttribute('disabled', '');
    expect(screen.getByText('1')).toHaveAttribute('tabindex', '0');
    screen.getByText('1').focus();
    expect(screen.getByText('1')).toHaveFocus();
  });

  it('should disable PaginationPrevious on the first page', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" disabled />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByLabelText('Go to previous page')).toHaveAttribute('disabled', '');
    expect(screen.getByLabelText('Go to next page')).not.toHaveAttribute('disabled');
    expect(screen.getByText('1')).toHaveAttribute('tabindex', '0');
    screen.getByText('1').focus();
    expect(screen.getByText('1')).toHaveFocus();
  });

  it('should disable PaginationNext on the last page', () => {
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
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" disabled />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    expect(screen.getByLabelText('Go to previous page')).not.toHaveAttribute('disabled');
    expect(screen.getByLabelText('Go to next page')).toHaveAttribute('disabled', '');
    expect(screen.getByText('1')).toHaveAttribute('tabindex', '0');
    screen.getByText('1').focus();
    expect(screen.getByText('1')).toHaveFocus();
  });


  it('should handle keyboard navigation correctly with disabled previous/next buttons', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" disabled />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

    const navigation = screen.getByRole('navigation');
    const prevLink = screen.getByLabelText('Go to previous page');
    const link1 = screen.getByText('1');
    const link2 = screen.getByText('2');
    const nextLink = screen.getByLabelText('Go to next page');

    // On initial render, link1 should be focused as it's the first non-disabled link.
    expect(prevLink).toHaveAttribute('disabled', '');
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    link1.focus(); // Manually focus for keyboard events
    expect(link1).toHaveFocus();

    // Attempt to navigate left from link1, should go to nextLink (last non-disabled element)
    fireEvent.keyDown(navigation, { key: 'ArrowLeft' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '0');
    expect(nextLink).toHaveFocus();

    // Navigate right from nextLink, should loop to link1 (skipping disabled prevLink)
    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();

    // Navigate right from link1, should go to link2
    fireEvent.keyDown(navigation, { key: 'ArrowRight' });
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '0');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveFocus();

    // Test Home and End keys with disabled prev/next
    fireEvent.keyDown(navigation, { key: 'End' });
    expect(prevLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveAttribute('tabindex', '-1');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '0');
    expect(nextLink).toHaveFocus();

    fireEvent.keyDown(navigation, { key: 'Home' });
    expect(prevLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveAttribute('tabindex', '0');
    expect(link2).toHaveAttribute('tabindex', '-1');
    expect(nextLink).toHaveAttribute('tabindex', '-1');
    expect(link1).toHaveFocus();
  });
});