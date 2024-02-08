import { ActionButtonRow, Content, DraggableTopBar, RootLayout, Sidebar } from '@/components'

const App = () => {
  return (
    <>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2 ">
          <ActionButtonRow className="flex justify-between mt-1" />
        </Sidebar>
        <Content className="border-l bg-zinc-700/50 border-l-white/20">Content</Content>
      </RootLayout>
    </>
  )
}

export default App
