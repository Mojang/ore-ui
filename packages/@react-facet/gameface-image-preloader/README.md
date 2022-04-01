# @react-facet/gameface-image-preloader

React Facet is a state management for performant game UIs. For more information on how to use this package check the
official documentation available at https://react-facet.mojang.com/.

There isn't support for the onLoad event in Gameface right now. Therefore, it's hard to create a smooth UI where
external images don't "pop in". This component solves that by rendering an invisible list of images, and invoking a
callback when all of them have received a height and width. This should, hopefully, mean that they have been cached by
the browser - which in turn should enable subsequent renders within the same animation frame.

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
