declare global {
  interface Window {
    // electron: ElectronAPI
    context: {
      locate: string
    }
  }
}
