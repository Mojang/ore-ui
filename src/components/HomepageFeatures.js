import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'

const FeatureList = [
  {
    title: 'Observable-based',
    description: (
      <>
        Each aspect of the UI subscribes to the facet of the state that is relevant for it, and will{' '}
        <strong>only</strong> update if that piece of state changes.
      </>
    ),
  },
  {
    title: 'Minimal reconciliation cost',
    description: (
      <>
        Observables mean that reconciliation is almost never necessary, creating orders of magnitude improvements in
        performance when updating individual styles in the leaves of a complex React tree.
      </>
    ),
  },
  {
    title: 'Mutable-objects friendly',
    description: (
      <>
        In Game UIs, object references are often shared with an underlying C++ / Java platform to avoid serialization
        costs, and updates often come via mutation: @react-facet supports this out-of-the-box
      </>
    ),
  },
]

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
