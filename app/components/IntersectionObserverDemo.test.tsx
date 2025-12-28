import { render, screen } from '@testing-library/react';
import IntersectionObserverDemo from './IntersectionObserverDemo';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({
    ref: jest.fn(),
  })),
}));

describe('IntersectionObserverDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with title', () => {
    render(<IntersectionObserverDemo />);
    expect(
      screen.getByText('Intersection Observer API Demo')
    ).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<IntersectionObserverDemo />);
    expect(
      screen.getByText(
        'スクロールして、ボックスがビューポートに入ると色が変わります'
      )
    ).toBeInTheDocument();
  });

  it('renders 8 boxes', () => {
    render(<IntersectionObserverDemo />);
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(`Box ${i}`)).toBeInTheDocument();
    }
  });

  it('renders all boxes with initial state as non-intersecting', () => {
    render(<IntersectionObserverDemo />);
    const nonVisibleTexts = screen.getAllByText('非表示');
    expect(nonVisibleTexts).toHaveLength(8);
  });

  it('renders status indicators in header for all boxes', () => {
    render(<IntersectionObserverDemo />);
    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(`Box ${i}: 0%`)).toBeInTheDocument();
    }
  });

  it('renders scroll helper text', () => {
    render(<IntersectionObserverDemo />);
    expect(screen.getByText('↓ スクロールしてください ↓')).toBeInTheDocument();
    expect(screen.getByText('↑ スクロールして戻る ↑')).toBeInTheDocument();
  });

  it('renders footer with MDN link', () => {
    render(<IntersectionObserverDemo />);
    const link = screen.getByRole('link', {
      name: /MDN - Intersection Observer API/i,
    });
    expect(link).toHaveAttribute(
      'href',
      'https://developer.mozilla.org/ja/docs/Web/API/Intersection_Observer_API'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
