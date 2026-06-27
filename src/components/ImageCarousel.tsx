import { useMemo, useState } from 'react';
import './ImageCarousel.css';

type CarouselImage = {
  src: string;
  alt: string;
  caption: string;
};

type ImageCarouselProps = {
  images: CarouselImage[];
};

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedImages = useMemo(() => {
    if (images.length > 0) {
      return images;
    }

    return [
      {
        src: '/images/cardinal-dawn.svg',
        alt: 'Cessna Cardinal parked on a sunlit ramp at dawn',
        caption: 'Early departures, smooth air, and dependable performance.'
      }
    ];
  }, [images]);

  const totalSlides = normalizedImages.length;

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? totalSlides - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    }
  };

  const activeImage = normalizedImages[activeIndex];

  return (
    <section
      aria-label="Aircraft photo gallery"
      className="carousel"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="carousel-frame">
        <img
          src={activeImage.src}
          alt={activeImage.alt}
          className="carousel-image"
          loading="lazy"
        />
        <div className="carousel-overlay">
          <p className="carousel-caption">{activeImage.caption}</p>
        </div>
      </div>

      <div className="carousel-controls" aria-label="Carousel navigation">
        <button
          type="button"
          className="carousel-button"
          onClick={goToPrevious}
          aria-label="Show previous image"
        >
          Previous
        </button>

        <div className="carousel-dots" role="tablist" aria-label="Select image">
          {normalizedImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              className={`carousel-dot ${index === activeIndex ? 'is-active' : ''}`}
              aria-selected={index === activeIndex}
              aria-label={`Show image ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        <button
          type="button"
          className="carousel-button"
          onClick={goToNext}
          aria-label="Show next image"
        >
          Next
        </button>
      </div>
    </section>
  );
}
