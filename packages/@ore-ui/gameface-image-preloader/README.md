# @ore-ui/gameface-image-preloader
There isn't support for the onLoad event in Gameface right now. Therefore, it's hard to create a smooth UI where
external images don't "pop in". This component solves that by rendering an invisible list of images, and invoking a
callback when all of them have received a height and width. This should, hopefully, mean that they have been cached by
the browser - which in turn should enable subsequent renders within the same animation frame.

This package is part of ore-ui(TODO: LINK), and uses @react-facet(TODO: LINK) for it's state management.

## Example

In the example below it will first show "Images are loading". When all images have finished loading it will display "All
images have finished loading".

```tsx
const SampleComponent = () => {
	const [imagesHaveLoaded, setImagesHaveLoaded] = useFacetState(false)
	const urls = ['https://example.com/img1.png', 'https://example.com/img2.png']
  return (
		<ImagePreloader imageUrls={urls} onImagesLoaded={() => setImagesHaveLoaded(true)} />
		<Mount when={imagesHaveLoaded} condition={false}>
			<p>Images are loading</p>
		</Mount>
		<Mount when={imagesHaveLoaded}>
			<p>All images have finished loading</p>
		</Mount>
  )
}

render(SampleComponent, document.getElementById('root'))
```
