import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ItemCard, type Item } from '../ItemCard';

// Wrapper component to provide router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ItemCard Component', () => {
  const mockItem: Item = {
    id: 1,
    name: 'Yoga Session',
    description: 'Relaxing yoga class for all skill levels. Join us for a peaceful experience.',
    price: 50,
    duration: '60 minutes',
    image: 'https://example.com/yoga.jpg',
    category: 'Wellness',
    provider: 'Zen Studio'
  };

  const renderItemCard = (item: Item) => {
    return render(
      <RouterWrapper>
        <ItemCard item={item} />
      </RouterWrapper>
    );
  };

  it('renders item name correctly', () => {
    renderItemCard(mockItem);
    expect(screen.getByText('Yoga Session')).toBeInTheDocument();
  });

  it('renders item description correctly', () => {
    renderItemCard(mockItem);
    expect(screen.getByText(/Relaxing yoga class for all skill levels/)).toBeInTheDocument();
  });

  it('displays price formatted correctly', () => {
    renderItemCard(mockItem);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    renderItemCard(mockItem);
    const image = screen.getByAltText('Yoga Session');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/yoga.jpg');
  });

  it('shows "No Image" placeholder when image is not provided', () => {
    const itemWithoutImage = { ...mockItem, image: undefined };
    renderItemCard(itemWithoutImage);
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('renders view details link with correct href', () => {
    renderItemCard(mockItem);
    const viewDetailsLink = screen.getByRole('link', { name: 'View Details' });
    expect(viewDetailsLink).toBeInTheDocument();
    expect(viewDetailsLink).toHaveAttribute('href', '/service/1');
  });

  it('handles different price formats', () => {
    const itemWithDecimalPrice = { ...mockItem, price: 49.99 };
    renderItemCard(itemWithDecimalPrice);
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('handles zero price', () => {
    const freeItem = { ...mockItem, price: 0 };
    renderItemCard(freeItem);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('truncates long descriptions appropriately', () => {
    const itemWithLongDescription = {
      ...mockItem,
      description: 'This is a very long description that should be truncated when displayed on the card to maintain a clean layout and consistent card heights across the grid. It goes on and on with lots of details about the service.'
    };
    renderItemCard(itemWithLongDescription);
    // The actual truncation is handled by CSS, but we can verify the text is present
    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
  });
});
