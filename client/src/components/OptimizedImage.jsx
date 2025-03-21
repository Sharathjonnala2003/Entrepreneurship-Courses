import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import usePerformance from '../hooks/usePerformance';

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: ${props => props.height || 'auto'};
  background-color: #f0f0f0;
  border-radius: ${props => props.borderRadius || '0'};
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  opacity: ${props => (props.loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const OptimizedImage = ({
  src,
  alt,
  height,
  objectFit = 'cover',
  borderRadius = '0',
  lazyLoad = true,
  fallbackSrc = 'https://via.placeholder.com/300x200?text=Image+Not+Available',
  placeholderColor = '#f0f0f0',
  ...props
}) => {
  const { renderCount } = usePerformance('OptimizedImage');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imageRef = useRef(null);

  // Try to use WebP if available
  useEffect(() => {
    // Check if WebP is supported
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      }
      return false;
    };

    // If WebP is supported and we're not already using it, try to use a WebP version
    if (supportsWebP() && !src.endsWith('.webp')) {
      const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');

      // Try to load WebP version
      const img = new Image();
      img.onload = () => setImageSrc(webpSrc);
      img.onerror = () => setImageSrc(src);
      img.src = webpSrc;
    }
  }, [src]);

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          imageRef.current.src = imageSrc;
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [lazyLoad, imageSrc]);

  const handleLoad = () => setIsLoaded(true);

  const handleError = () => {
    setError(true);
    setImageSrc(fallbackSrc);
  };

  return (
    <ImageContainer height={height} borderRadius={borderRadius} {...props}>
      <Placeholder visible={!isLoaded} />
      <StyledImage
        ref={imageRef}
        src={lazyLoad ? 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' : imageSrc}
        data-src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loaded={isLoaded}
        objectFit={objectFit}
      />
    </ImageContainer>
  );
};

export default OptimizedImage;
