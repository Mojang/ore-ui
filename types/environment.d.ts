declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
    }

    interface Global {
      window: Window
    }
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __REACT_FACET_DEV_TOOLS__?: Record<string, any>
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
// see: https://stackoverflow.com/questions/45194598/using-process-env-in-typescript/53981706#53981706
export {}
