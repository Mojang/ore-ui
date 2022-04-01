import {
  FacetProp,
  Mount,
  Map,
  useFacetCallback,
  useFacetLayoutEffect,
  useFacetState,
  useFacetWrap,
} from '@react-facet/core'
import React, { useCallback, useRef } from 'react'

function elementHasWidthAndHeight(element: HTMLElement): boolean {
  const domRect = element.getBoundingClientRect()
  return domRect.height > 0 && domRect.width > 0
}

type ImagePreloaderProps = {
  imageUrls: FacetProp<Array<string>>
  onImagesLoaded: () => void
}

// Gameface doesn't support the onLoad event for images. This component will prefetch images from
// urls - so that the browser can cache them. It is being rendered with visibility set to hidden,
// and will invoke a callback when all of the images have been laid out.
export function ImagePreloader({ imageUrls, onImagesLoaded }: ImagePreloaderProps) {
  const images = useFacetWrap(imageUrls)
  const [hasLoadedAllImages, setHasLoadedAllImages] = useFacetState(false)

  // Store a reference to all image nodes
  const imageRefs = useRef([] as Array<HTMLImageElement>)
  const imageRefCallback = useCallback((element: HTMLImageElement | null, index: number) => {
    // If the element is null it means that the component is dismounting. Lets clear the array for good measure.
    if (element == null) {
      return delete imageRefs.current[index]
    }
    imageRefs.current[index] = element
  }, [])

  // This check will continue to run on each animation frame until all of the images have been drawn out.
  const animationFrameRef = useRef<number | null>(null)
  const checkIfAllImagesHaveLoaded = useFacetCallback(
    (images) => () => {
      // Make sure we've received the ref to all the image nodes, if not queue a check on the next animation frame.
      if (imageRefs.current.length !== images.length) {
        animationFrameRef.current = window.requestAnimationFrame(checkIfAllImagesHaveLoaded)
        return
      }

      // If we have a reference to all of the nodes we need to check if they have a height and
      // width. If they don't it means that the images haven't been drawn yet, and we should queue
      // another check on the next animation frame.
      if (!imageRefs.current.every(elementHasWidthAndHeight)) {
        animationFrameRef.current = window.requestAnimationFrame(checkIfAllImagesHaveLoaded)
        return
      }

      // If we reach here it means that all the images have loaded so we'll invoke the callback
      // on the next animation frame.
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setHasLoadedAllImages(true)
        onImagesLoaded()
      })
    },
    [onImagesLoaded, setHasLoadedAllImages],
    [images],
  )
  // This effect will start running the check as soon as we've got some image urls.
  useFacetLayoutEffect(
    (images, hasLoadedAllImages) => {
      if (images.length && !hasLoadedAllImages) {
        checkIfAllImagesHaveLoaded()
      }
      return () => animationFrameRef.current != null && window.cancelAnimationFrame(animationFrameRef.current)
    },
    [checkIfAllImagesHaveLoaded],
    [images, hasLoadedAllImages],
  )

  return (
    <Mount when={hasLoadedAllImages} condition={false}>
      <div style={{ visibility: 'hidden' }}>
        <Map array={images}>
          {(image, index) => <fast-img src={image} ref={(element) => imageRefCallback(element, index)} />}
        </Map>
      </div>
    </Mount>
  )
}
