import { act, render, screen } from '@testing-library/react';
import { useInView } from 'react-intersection-observer';
import IntersectionObserverDemo from './IntersectionObserverDemo';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(),
}));

describe('IntersectionObserverDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useInView as jest.Mock).mockImplementation(() => ({
      ref: jest.fn(),
    }));
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

  it('updates box state when useInView reports intersection changes', () => {
    type OnChange = (inView: boolean, entry: IntersectionObserverEntry) => void;
    let capturedOnChange: OnChange | null = null;

    (useInView as jest.Mock).mockImplementationOnce(
      (options: { onChange?: OnChange }) => {
        capturedOnChange = options?.onChange ?? null;
        return { ref: jest.fn() };
      }
    );

    render(<IntersectionObserverDemo />);

    expect(capturedOnChange).not.toBeNull();
    act(() => {
      capturedOnChange?.(true, {
        intersectionRatio: 0.5,
      } as IntersectionObserverEntry);
    });

    expect(screen.getByText('表示中')).toBeInTheDocument();
    expect(screen.getByText('Box 1: 50%')).toBeInTheDocument();
    expect(screen.getAllByText('非表示')).toHaveLength(7);
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
