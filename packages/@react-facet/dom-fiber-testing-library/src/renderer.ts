import { ReactElement } from 'react'
import * as testingLibrary from '@testing-library/dom'
import { setupAct } from './setupAct'
import {
  Matcher,
  MatcherOptions,
  waitForOptions,
  SelectorMatcherOptions,
  ByRoleMatcher,
  ByRoleOptions,
  FireFunction,
  FireObject,
} from '@testing-library/dom'
import { createReconciler, createFiberRoot, FacetFiberRoot } from '@react-facet/dom-fiber'

/**
 * Custom testing-library implementation based on https://github.com/testing-library/react-testing-library
 *
 * It keeps the API compatibility, but supporting our custom facet renderer.
 *
 * More information at https://testing-library.com/docs/react-testing-library/intro/
 */
const setup = () => {
  const reconcilerInstance = createReconciler()

  const mountedContainers = new Set<ContainerRootFiberTuple>()

  const act = setupAct(reconcilerInstance)

  function render(
    ui: ReactElement,
    baseElement: HTMLElement = document.body,
    customContainer?: HTMLElement,
    customFiberRoot?: FacetFiberRoot,
  ): RenderResult {
    const container = customContainer ?? baseElement.appendChild(document.createElement('div'))
    const fiberRoot = customFiberRoot ?? createFiberRoot(reconcilerInstance)(container)

    mountedContainers.add([container, fiberRoot])

    act(() => {
      reconcilerInstance.updateContainer(ui, fiberRoot, null, () => {})
    })

    return {
      container,
      baseElement,
      debug: (el = baseElement, maxLength, options) =>
        Array.isArray(el)
          ? el.forEach((e) => console.log(testingLibrary.prettyDOM(e, maxLength, options)))
          : console.log(testingLibrary.prettyDOM(el, maxLength, options)),
      unmount: () => {
        act(() => {
          reconcilerInstance.updateContainer(null, fiberRoot, null, () => {})
        })
      },
      rerender: (rerenderUi: ReactElement) => {
        render(rerenderUi, baseElement, container, fiberRoot)
      },
      asFragment: () => {
        if (typeof document.createRange === 'function') {
          return document.createRange().createContextualFragment(container.innerHTML)
        } else {
          const template = document.createElement('template')
          template.innerHTML = container.innerHTML
          return template.content
        }
      },
      ...(testingLibrary.getQueriesForElement(container) as Queries),
    }
  }

  function cleanup() {
    mountedContainers.forEach(cleanupAtContainer)
  }

  function cleanupAtContainer(tuple: ContainerRootFiberTuple) {
    const [container, fiberRoot] = tuple

    act(() => {
      reconcilerInstance.updateContainer(null, fiberRoot, null, () => {})
    })

    if (container.parentNode === document.body) {
      document.body.removeChild(container)
    }

    mountedContainers.delete(tuple)
  }

  if (typeof afterEach === 'function') {
    afterEach(() => {
      cleanup()
    })
  }

  const fireEventFunction: FireFunction = (...args) => act(() => testingLibrary.fireEvent(...args))

  const fireEvent = fireEventFunction as FireFunction & FireObject

  mapKeys(testingLibrary.fireEvent as FireObject, (typeArg) => {
    fireEvent[typeArg] = (...args) => act(() => testingLibrary.fireEvent[typeArg](...args))
  })

  return { act, render, cleanup, fireEvent }
}

export type QueryByBoundAttribute = (id: Matcher, options?: MatcherOptions) => HTMLElement | null

export type AllByBoundAttribute = (id: Matcher, options?: MatcherOptions) => HTMLElement[]

export type FindAllByBoundAttribute = (
  id: Matcher,
  options?: MatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type GetByBoundAttribute = (id: Matcher, options?: MatcherOptions) => HTMLElement

export type FindByBoundAttribute = (
  id: Matcher,
  options?: MatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

export type QueryByText = (id: Matcher, options?: SelectorMatcherOptions) => HTMLElement | null

export type AllByText = (id: Matcher, options?: SelectorMatcherOptions) => HTMLElement[]

export type FindAllByText = (
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type GetByText = (id: Matcher, options?: SelectorMatcherOptions) => HTMLElement

export type FindByText = (
  id: Matcher,
  options?: SelectorMatcherOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

export type AllByRole = (role: ByRoleMatcher, options?: ByRoleOptions) => HTMLElement[]

export type GetByRole = (role: ByRoleMatcher, options?: ByRoleOptions) => HTMLElement

export type QueryByRole = (role: ByRoleMatcher, options?: ByRoleOptions) => HTMLElement | null

export type FindByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement>

export type FindAllByRole = (
  role: ByRoleMatcher,
  options?: ByRoleOptions,
  waitForElementOptions?: waitForOptions,
) => Promise<HTMLElement[]>

export type Queries = {
  getByLabelText: GetByText
  getAllByLabelText: AllByText
  queryByLabelText: QueryByText
  queryAllByLabelText: AllByText
  findByLabelText: FindByText
  findAllByLabelText: FindAllByText
  getByPlaceholderText: GetByBoundAttribute
  getAllByPlaceholderText: AllByBoundAttribute
  queryByPlaceholderText: QueryByBoundAttribute
  queryAllByPlaceholderText: AllByBoundAttribute
  findByPlaceholderText: FindByBoundAttribute
  findAllByPlaceholderText: FindAllByBoundAttribute
  getByText: GetByText
  getAllByText: AllByText
  queryByText: QueryByText
  queryAllByText: AllByText
  findByText: FindByText
  findAllByText: FindAllByText
  getByAltText: GetByBoundAttribute
  getAllByAltText: AllByBoundAttribute
  queryByAltText: QueryByBoundAttribute
  queryAllByAltText: AllByBoundAttribute
  findByAltText: FindByBoundAttribute
  findAllByAltText: FindAllByBoundAttribute
  getByTitle: GetByBoundAttribute
  getAllByTitle: AllByBoundAttribute
  queryByTitle: QueryByBoundAttribute
  queryAllByTitle: AllByBoundAttribute
  findByTitle: FindByBoundAttribute
  findAllByTitle: FindAllByBoundAttribute
  getByDisplayValue: GetByBoundAttribute
  getAllByDisplayValue: AllByBoundAttribute
  queryByDisplayValue: QueryByBoundAttribute
  queryAllByDisplayValue: AllByBoundAttribute
  findByDisplayValue: FindByBoundAttribute
  findAllByDisplayValue: FindAllByBoundAttribute
  getByRole: GetByRole
  getAllByRole: AllByRole
  queryByRole: QueryByRole
  queryAllByRole: AllByRole
  findByRole: FindByRole
  findAllByRole: FindAllByRole
  getByTestId: GetByBoundAttribute
  getAllByTestId: AllByBoundAttribute
  queryByTestId: QueryByBoundAttribute
  queryAllByTestId: AllByBoundAttribute
  findByTestId: FindByBoundAttribute
  findAllByTestId: FindAllByBoundAttribute
}

const mapKeys = <T extends Record<string, unknown>, V>(x: T, callback: (v: keyof T) => V): V[] => {
  const a = []
  let b: keyof T
  for (b in x) {
    a.push(callback(b))
  }
  return a
}

export type RenderResult = {
  container: HTMLElement
  baseElement: HTMLElement
  debug: (
    baseElement?: Element | HTMLDocument | Array<Element | HTMLDocument>,
    maxLength?: number,
    options?: testingLibrary.PrettyDOMOptions,
  ) => void
  rerender: (ui: React.ReactElement) => void
  unmount: () => void
  asFragment: () => DocumentFragment
} & Queries

type ContainerRootFiberTuple = [HTMLElement, FacetFiberRoot]

const environment = setup()
export const act = environment.act
export const render = environment.render
export const cleanup = environment.cleanup
export * from '@testing-library/dom'
export const fireEvent = environment.fireEvent
